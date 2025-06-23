const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for rooms
const rooms = new Map();
const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

// Room structure
class Room {
  constructor(id) {
    this.id = id;
    this.users = new Map();
    this.cursors = new Map();
    this.history = [];
    this.files = new Map();
    this.activeFile = 'main.js';
    this.chat = [];
    this.lastSaved = Date.now();
    
    // Initialize with a default file
    this.files.set('main.js', {
      name: 'main.js',
      content: '// Welcome to the collaborative code editor!\n// Start typing to see real-time collaboration in action\n\nconsole.log("Hello, World!");',
      language: 'javascript'
    });
  }

  addUser(socketId, username) {
    const colorIndex = this.users.size % userColors.length;
    const user = {
      id: socketId,
      username: username || `User${this.users.size + 1}`,
      color: userColors[colorIndex],
      joinedAt: Date.now(),
      cursor: { line: 0, ch: 0 }
    };
    
    this.users.set(socketId, user);
    return user;
  }

  removeUser(socketId) {
    this.users.delete(socketId);
    this.cursors.delete(socketId);
  }

  updateCode(fileName, content) {
    const file = this.files.get(fileName);
    if (file) {
      file.content = content;
      
      // Add to history for replay feature
      this.history.push({
        timestamp: Date.now(),
        content,
        fileName
      });

      // Keep history limited to last 1000 operations
      if (this.history.length > 1000) {
        this.history = this.history.slice(-1000);
      }
    }
  }

  updateCursor(socketId, cursor) {
    this.cursors.set(socketId, {
      ...cursor,
      userId: socketId,
      timestamp: Date.now()
    });
  }

  addChatMessage(message) {
    this.chat.push({
      ...message,
      timestamp: Date.now()
    });

    // Keep chat limited to last 100 messages
    if (this.chat.length > 100) {
      this.chat = this.chat.slice(-100);
    }
  }

  switchFile(fileName) {
    if (this.files.has(fileName)) {
      this.activeFile = fileName;
      return this.files.get(fileName);
    }
    return null;
  }

  createFile(fileName, content = '', language = 'javascript') {
    if (!this.files.has(fileName)) {
      const file = {
        name: fileName,
        content,
        language
      };
      this.files.set(fileName, file);
      return file;
    }
    return null;
  }

  deleteFile(fileName) {
    if (fileName !== 'main.js' && this.files.has(fileName)) {
      this.files.delete(fileName);
      if (this.activeFile === fileName) {
        this.activeFile = 'main.js';
      }
      return true;
    }
    return false;
  }

  getState() {
    return {
      roomId: this.id,
      activeFile: this.activeFile,
      files: Array.from(this.files.values()),
      users: Array.from(this.users.values()),
      cursors: Array.from(this.cursors.values()),
      chat: this.chat.slice(-50) // Send last 50 messages
    };
  }
}

// Utility functions
function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Room(roomId));
  }
  return rooms.get(roomId);
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  let currentRoom = null;
  let currentUser = null;

  // Join room
  socket.on('join-room', (data) => {
    const { roomId, username } = data;
    
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    currentRoom = roomId;
    const room = getOrCreateRoom(roomId);
    currentUser = room.addUser(socket.id, username);
    
    socket.join(roomId);
    
    // Send current state to the new user
    socket.emit('room-state', room.getState());
    
    // Notify others about the new user
    socket.to(roomId).emit('user-joined', currentUser);
    
    console.log(`User ${currentUser.username} joined room ${roomId}`);
  });

  // FIXED: Handle code changes properly
  socket.on('code-change', (data) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const { content, operation } = data;
    const fileName = operation?.fileName || room.activeFile;
    
    room.updateCode(fileName, content);

    // Broadcast to all other users in the room
    socket.to(currentRoom).emit('code-update', {
      content,
      fileName,
      user: currentUser
    });
  });

  // FIXED: Handle cursor position updates properly
  socket.on('cursor-change', (cursor) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    room.updateCursor(socket.id, cursor);
    
    // Broadcast cursor position to others
    socket.to(currentRoom).emit('cursor-update', {
      userId: socket.id,
      username: currentUser.username,
      color: currentUser.color,
      cursor
    });
  });

  // FIXED: Handle file operations properly
  socket.on('switch-file', (fileName) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const file = room.switchFile(fileName);
    if (file) {
      socket.emit('file-switched', {
        fileName,
        content: file.content,
        language: file.language
      });
      
      // Notify others about the active file change
      socket.to(currentRoom).emit('active-file-changed', fileName);
    }
  });

  socket.on('create-file', (data) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const { fileName, language } = data;
    const file = room.createFile(fileName, '', language);
    
    if (file) {
      io.to(currentRoom).emit('file-created', file);
    } else {
      socket.emit('error', { message: 'File already exists or invalid name' });
    }
  });

  socket.on('delete-file', (fileName) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    if (room.deleteFile(fileName)) {
      io.to(currentRoom).emit('file-deleted', {
        fileName,
        newActiveFile: room.activeFile
      });
    }
  });

  // FIXED: Handle chat messages properly
  socket.on('chat-message', (message) => {
    if (!currentRoom || !currentUser) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const chatMessage = {
      id: Date.now() + socket.id,
      userId: socket.id,
      username: currentUser.username,
      color: currentUser.color,
      message: typeof message === 'string' ? message.trim() : message?.message?.trim() || '',
      timestamp: Date.now()
    };

    room.addChatMessage(chatMessage);
    
    // Broadcast to all users in the room
    io.to(currentRoom).emit('chat-message', chatMessage);
  });

  // Handle replay request
  socket.on('get-replay', (data) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const { fromTimestamp, toTimestamp } = data;
    const replayData = room.history.filter(op => 
      op.timestamp >= (fromTimestamp || 0) && 
      op.timestamp <= (toTimestamp || Date.now())
    );

    socket.emit('replay-data', replayData);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (currentRoom && currentUser) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.removeUser(socket.id);
        
        // Notify others about user leaving
        socket.to(currentRoom).emit('user-left', {
          userId: socket.id,
          username: currentUser.username
        });

        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(currentRoom);
          console.log(`Room ${currentRoom} cleaned up (empty)`);
        }
      }
    }
  });

  // Handle ping for connection health
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Auto-save functionality
const autoSave = async () => {
  const saveDir = path.join(__dirname, 'saved-rooms');
  
  try {
    await fs.mkdir(saveDir, { recursive: true });
    
    for (const [roomId, room] of rooms) {
      if (Date.now() - room.lastSaved > 5 * 60 * 1000) { // 5 minutes
        const roomData = {
          id: roomId,
          files: Object.fromEntries(room.files),
          activeFile: room.activeFile,
          lastSaved: Date.now(),
          userCount: room.users.size
        };
        
        await fs.writeFile(
          path.join(saveDir, `${roomId}.json`),
          JSON.stringify(roomData, null, 2)
        );
        
        room.lastSaved = Date.now();
        console.log(`Auto-saved room: ${roomId}`);
      }
    }
  } catch (error) {
    console.error('Auto-save error:', error);
  }
};

// Run auto-save every 2 minutes
setInterval(autoSave, 2 * 60 * 1000);

// REST API endpoints
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    userCount: room.users.size,
    fileCount: room.files.size,
    lastActivity: Math.max(...room.history.map(h => h.timestamp), 0)
  }));
  
  res.json(roomList);
});

app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.get(req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json(room.getState());
});

app.post('/api/rooms/:id/files', (req, res) => {
  const room = rooms.get(req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const { fileName, content, language } = req.body;
  const file = room.createFile(fileName, content, language);
  
  if (file) {
    res.json(file);
  } else {
    res.status(400).json({ error: 'File already exists or invalid name' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeRooms: rooms.size,
    totalConnections: io.engine.clientsCount,
    uptime: process.uptime()
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Collaborative Code Editor Server running on port ${PORT}`);
  console.log(`📁 Auto-save enabled (every 2 minutes)`);
  console.log(`🔄 WebSocket ready for real-time collaboration`);
});