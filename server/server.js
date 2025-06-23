require('dotenv').config();

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
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Configuration from environment variables
const config = {
  port: process.env.PORT || 3001,
  autoSaveInterval: parseInt(process.env.AUTO_SAVE_INTERVAL) || 120000,
  roomHistoryLimit: parseInt(process.env.ROOM_HISTORY_LIMIT) || 1000,
  chatMessageLimit: parseInt(process.env.CHAT_MESSAGE_LIMIT) || 100,
  roomCleanupInterval: parseInt(process.env.ROOM_CLEANUP_INTERVAL) || 300000,
  saveDirectory: process.env.SAVE_DIRECTORY || './saved-rooms',
  maxConnectionsPerRoom: parseInt(process.env.MAX_CONNECTIONS_PER_ROOM) || 50,
  maxTotalRooms: parseInt(process.env.MAX_TOTAL_ROOMS) || 1000,
  logLevel: process.env.LOG_LEVEL || 'info'
};

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
    this.code = '';
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

  updateCode(content, operation) {
    const activeFile = this.files.get(this.activeFile);
    if (activeFile) {
      activeFile.content = content;
      
      // Add to history for replay feature
      this.history.push({
        timestamp: Date.now(),
        operation,
        content,
        file: this.activeFile
      });

      // Keep history limited to configurable limit
      if (this.history.length > config.roomHistoryLimit) {
        this.history = this.history.slice(-config.roomHistoryLimit);
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

    // Keep chat limited to configurable limit
    if (this.chat.length > config.chatMessageLimit) {
      this.chat = this.chat.slice(-config.chatMessageLimit);
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
    const activeFile = this.files.get(this.activeFile);
    return {
      roomId: this.id,
      code: activeFile ? activeFile.content : '',
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

function transformOperation(op, otherOps) {
  // Basic operational transformation
  // This is a simplified version - in production, you'd want a more robust OT system
  let transformedOp = { ...op };
  
  for (const otherOp of otherOps) {
    if (otherOp.timestamp < op.timestamp) {
      if (otherOp.type === 'insert' && otherOp.position <= transformedOp.position) {
        transformedOp.position += otherOp.text.length;
      } else if (otherOp.type === 'delete' && otherOp.position < transformedOp.position) {
        transformedOp.position -= Math.min(otherOp.length, transformedOp.position - otherOp.position);
      }
    }
  }
  
  return transformedOp;
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

  // Handle code changes
  socket.on('code-change', (data) => {
    if (!currentRoom) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const { content, operation } = data;
    
    // Apply operational transformation if needed
    const recentOps = room.history.slice(-10); // Check last 10 operations
    const transformedOp = transformOperation(operation, recentOps);
    
    room.updateCode(content, {
      ...transformedOp,
      userId: socket.id,
      username: currentUser.username
    });

    // Broadcast to all other users in the room
    socket.to(currentRoom).emit('code-update', {
      content,
      operation: transformedOp,
      user: currentUser
    });
  });

  // Handle cursor position updates
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

  // Handle file operations
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

  // Handle chat messages
  socket.on('chat-message', (message) => {
    if (!currentRoom || !currentUser) return;
    
    const room = rooms.get(currentRoom);
    if (!room) return;

    const chatMessage = {
      id: Date.now() + socket.id,
      userId: socket.id,
      username: currentUser.username,
      color: currentUser.color,
      message: message.trim()
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
  const saveDir = path.join(__dirname, config.saveDirectory);
  
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

// Run auto-save at configured interval
setInterval(autoSave, config.autoSaveInterval);

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

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`🚀 Collaborative Code Editor Server running on port ${PORT}`);
  console.log(`📁 Auto-save enabled (every ${config.autoSaveInterval/1000} seconds)`);
  console.log(`🔄 WebSocket ready for real-time collaboration`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});