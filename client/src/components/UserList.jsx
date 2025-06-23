import React from 'react';
import { User, Crown, Circle } from 'lucide-react';

const UserList = ({ users, currentUser }) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (userId) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    return colors[userId?.charCodeAt(0) % colors.length] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Collaborators</h2>
        </div>
        <p className="text-sm text-gray-400">{users.length} online</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {users.map((user) => {
            const isCurrentUser = user.username === currentUser;
            return (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-blue-600/20 border border-blue-600/30' 
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    {getInitials(user.username)}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <Circle className="w-4 h-4 text-green-400 fill-current" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-white truncate">
                      {user.username}
                    </p>
                    {isCurrentUser && (
                      <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {isCurrentUser ? 'That\'s you!' : 'Active now'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No collaborators yet</p>
            <p className="text-sm text-gray-500 mt-1">Share the room ID to invite others</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;