import React, { useState } from 'react';
import { Plus, X, File, Code, Database, Image, Settings } from 'lucide-react';

const FileManager = ({ files, activeFile, onFileSwitch, onCreateFile, onDeleteFile }) => {
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      js: Code,
      jsx: Code,
      ts: Code,
      tsx: Code,
      html: Code,
      css: Code,
      scss: Code,
      py: Code,
      java: Code,
      cpp: Code,
      c: Code,
      php: Code,
      rb: Code,
      go: Code,
      rust: Code,
      sql: Database,
      json: Settings,
      xml: Settings,
      yml: Settings,
      yaml: Settings,
      md: File,
      txt: File,
      png: Image,
      jpg: Image,
      jpeg: Image,
      gif: Image,
      svg: Image
    };
    return iconMap[ext] || File;
  };

  const getLanguageFromExtension = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const langMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      sql: 'sql',
      json: 'json',
      xml: 'xml',
      yml: 'yaml',
      yaml: 'yaml',
      md: 'markdown',
      txt: 'plaintext'
    };
    return langMap[ext] || 'plaintext';
  };

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.js`;
    const language = getLanguageFromExtension(fileName);
    
    onCreateFile(fileName, language);
    setNewFileName('');
    setNewFileLanguage('javascript');
    setShowNewFileModal(false);
  };

  const handleDeleteFile = (fileName) => {
    if (Object.keys(files).length <= 1) {
      alert('Cannot delete the last file');
      return;
    }
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      onDeleteFile(fileName);
    }
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-2 py-2 flex items-center overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-0">
          {Object.keys(files).map((fileName) => {
            const Icon = getFileIcon(fileName);
            const isActive = fileName === activeFile;
            
            return (
              <div
                key={fileName}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-gray-700 text-white border border-gray-600' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => onFileSwitch(fileName)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{fileName}</span>
                {Object.keys(files).length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(fileName);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowNewFileModal(true)}
          className="ml-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          title="Create new file"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Create New File</h3>
            
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-300 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., utils.js, styles.css, README.md"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFileModal(false);
                    setNewFileName('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFileName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FileManager;