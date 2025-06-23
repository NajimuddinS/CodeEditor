import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Users, MessageCircle, Code, Plus, X, Play, Save } from "lucide-react";
import CodeEditor from "./components/CodeEditor.jsx";
import UserList from "./components/UserList.jsx";
import Chat from "./components/Chat.jsx";
import FileManager from "./components/FileManager.jsx";
import RoomJoin from "./components/RoomJoin.jsx";

// FIXED: Typo in backend URL
const BACKEND_URL = "https://codeeditor-9d33.onrender.com";

function App() {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("main.js");
  const [code, setCode] = useState(
    '// Welcome to Collaborative Code Editor\n// Start typing to see real-time collaboration!\n\nconsole.log("Hello, World!");'
  );
  const [cursors, setCursors] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    if (socket) {
      // Connection events
      socket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      // FIXED: Updated room state handling to match backend
      socket.on("room-state", (data) => {
        console.log("Room state received:", data);
        setUsers(data.users || []);

        // Convert files array back to object format
        if (data.files && Array.isArray(data.files)) {
          const filesObj = {};
          data.files.forEach((file) => {
            filesObj[file.name] = file;
          });
          setFiles(filesObj);
        } else {
          setFiles(
            data.files || {
              "main.js": { content: code, language: "javascript" },
            }
          );
        }

        // Set active file and its content
        if (data.activeFile) {
          setActiveFile(data.activeFile);
          const activeFileData =
            data.files?.find((f) => f.name === data.activeFile) ||
            data.files?.[data.activeFile];
          if (activeFileData) {
            setCode(activeFileData.content);
          }
        }

        setChatMessages(data.chat || []);
      });

      socket.on("user-joined", (user) => {
        setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
      });

      // FIXED: Handle user-left event properly
      socket.on("user-left", (data) => {
        const userId = data.userId || data;
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setCursors((prev) => {
          const newCursors = { ...prev };
          delete newCursors[userId];
          return newCursors;
        });
      });

      // FIXED: Updated code-update handler to match backend events
      socket.on("code-update", (data) => {
        if (data.fileName === activeFile || !data.fileName) {
          setCode(data.content);
        }
        setFiles((prev) => ({
          ...prev,
          [data.fileName || activeFile]: {
            ...prev[data.fileName || activeFile],
            content: data.content,
            name: data.fileName || activeFile,
          },
        }));
      });

      // FIXED: Updated cursor handling to match backend format
      socket.on("cursor-update", (data) => {
        setCursors((prev) => ({
          ...prev,
          [data.userId]: {
            position: data.cursor || data.position,
            username: data.username,
            color: data.color,
          },
        }));
      });

      // FIXED: File management events to match backend
      socket.on("file-created", (fileData) => {
        setFiles((prev) => ({
          ...prev,
          [fileData.name]: fileData,
        }));
      });

      socket.on("file-deleted", (data) => {
        setFiles((prev) => {
          const newFiles = { ...prev };
          delete newFiles[data.fileName];
          return newFiles;
        });
        if (activeFile === data.fileName) {
          const newActiveFile = data.newActiveFile || "main.js";
          setActiveFile(newActiveFile);
          if (files[newActiveFile]) {
            setCode(files[newActiveFile].content);
          }
        }
      });

      // FIXED: Handle file switching properly
      socket.on("file-switched", (data) => {
        setActiveFile(data.fileName);
        setCode(data.content);
      });

      socket.on("active-file-changed", (fileName) => {
        setActiveFile(fileName);
        if (files[fileName]) {
          setCode(files[fileName].content);
        }
      });

      // Chat events
      socket.on("chat-message", (message) => {
        setChatMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("room-state");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("code-update");
        socket.off("cursor-update");
        socket.off("file-created");
        socket.off("file-deleted");
        socket.off("file-switched");
        socket.off("active-file-changed");
        socket.off("chat-message");
      };
    }
  }, [socket, activeFile, files, code]);

  const connectToRoom = (roomData) => {
    const newSocket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);
    setRoomId(roomData.roomId);
    setUsername(roomData.username);

    newSocket.emit("join-room", {
      roomId: roomData.roomId,
      username: roomData.username,
    });
  };

  // FIXED: Updated to match backend expectations
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && isConnected) {
      socket.emit("code-change", {
        content: newCode,
        operation: {
          type: "update",
          timestamp: Date.now(),
          fileName: activeFile,
        },
      });
    }
  };

  // FIXED: Updated cursor change to match backend format
  const handleCursorChange = (position) => {
    if (socket && isConnected) {
      socket.emit("cursor-change", {
        line: position.lineNumber,
        ch: position.column,
        fileName: activeFile,
        timestamp: Date.now(),
      });
    }
  };

  const handleFileSwitch = (fileName) => {
    if (socket && isConnected) {
      socket.emit("switch-file", fileName);
    }
  };

  const handleCreateFile = (fileName, language = "javascript") => {
    if (socket && isConnected) {
      socket.emit("create-file", { fileName, language });
    }
  };

  const handleDeleteFile = (fileName) => {
    if (socket && isConnected && Object.keys(files).length > 1) {
      socket.emit("delete-file", fileName);
    }
  };

  const handleSendMessage = (message) => {
    if (socket && isConnected) {
      socket.emit("chat-message", message);
    }
  };

  if (!socket || !isConnected) {
    return <RoomJoin onConnect={connectToRoom} />;
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-semibold">CodeCollab</h1>
          </div>
          <div className="text-sm text-gray-400">
            Room: <span className="text-white font-mono">{roomId}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span className="text-sm text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className={`p-2 rounded-lg transition-colors ${
              showUsers
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title="Toggle User List"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors relative ${
              showChat
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title="Toggle Chat"
          >
            <MessageCircle className="w-5 h-5" />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chatMessages.length > 99 ? "99+" : chatMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <FileManager
            files={files}
            activeFile={activeFile}
            onFileSwitch={handleFileSwitch}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
          />

          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor
              ref={editorRef}
              code={code}
              language={files[activeFile]?.language || "javascript"}
              onChange={handleCodeChange}
              onCursorChange={handleCursorChange}
              cursors={cursors}
              currentUser={username}
            />
          </div>
        </div>

        {/* Side Panels */}
        <div className="flex">
          {/* User List Panel */}
          {showUsers && (
            <div className="w-64 bg-gray-800 border-l border-gray-700">
              <UserList users={users} currentUser={username} />
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-gray-800 border-l border-gray-700">
              <Chat
                messages={chatMessages}
                currentUser={username}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
