import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const Chat = ({ messages, currentUser, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    onSendMessage(inputMessage.trim());
    setInputMessage('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (username) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    return colors[username?.charCodeAt(0) % colors.length] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Chat</h2>
        </div>
        <p className="text-sm text-gray-400">{messages.length} messages</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.username === currentUser;
            const showAvatar = index === 0 || messages[index - 1].username !== msg.username;
            
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {showAvatar ? (
                  <div
                    className={`w-8 h-8 ${getAvatarColor(msg.username)} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                  >
                    {getInitials(msg.username)}
                  </div>
                ) : (
                  <div className="w-8 h-8 flex-shrink-0" />
                )}
                
                <div className={`flex flex-col max-w-[240px] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {showAvatar && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-300">
                        {msg.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-700 text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;