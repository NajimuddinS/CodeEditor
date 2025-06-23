import React, { useState } from 'react';
import { Code, Users, MessageCircle, Zap } from 'lucide-react';

const RoomJoin = ({ onConnect }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId.trim() || !username.trim()) return;
    
    setIsJoining(true);
    try {
      await onConnect({ roomId: roomId.trim(), username: username.trim() });
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsJoining(false);
    }
  };

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomId(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Code className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">CodeCollab</h1>
          <p className="text-xl text-gray-300 mb-8">Real-time collaborative code editor</p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Real-time Sync</h3>
              </div>
              <p className="text-gray-300">See changes instantly as your team types, with live cursor tracking.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Team Presence</h3>
              </div>
              <p className="text-gray-300">Know who's online and where they're working in your codebase.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-3">
                <MessageCircle className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Integrated Chat</h3>
              </div>
              <p className="text-gray-300">Discuss code changes without leaving the editor environment.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur rounded-2xl p-8 border border-gray-700 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Join a Room</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isJoining}
              />
            </div>
            
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Enter room ID"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  required
                  disabled={isJoining}
                />
                <button
                  type="button"
                  onClick={generateRoomId}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isJoining}
                  title="Generate random room ID"
                >
                  ⚡
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!roomId.trim() || !username.trim() || isJoining}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isJoining ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connecting...
                </div>
              ) : (
                'Join Room'
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Share the Room ID with your team to collaborate together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;