import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = forwardRef(({ code, language, onChange, onCursorChange, cursors, currentUser }, ref) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);
  const editingStatusRef = useRef({});

  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
    getMonaco: () => monacoRef.current
  }));

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor
    editor.getModel().updateOptions({ tabSize: 2, insertSpaces: true });

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column
        });
      }
    });

    // Handle content changes
    editor.onDidChangeModelContent((e) => {
      if (onChange) {
        onChange(editor.getValue());
      }
      
      // Mark current user as editing
      if (currentUser) {
        editingStatusRef.current[currentUser] = Date.now();
        updateEditingDecorations();
      }
    });
  };

  // Update cursor decorations when cursors change
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      // Clear previous decorations
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);

      // Create new decorations for other users' cursors
      const newDecorations = Object.entries(cursors)
        .filter(([userId, cursor]) => {
          return cursor && cursor.position && 
                 typeof cursor.position.lineNumber === 'number' && 
                 typeof cursor.position.column === 'number';
        })
        .map(([userId, cursor]) => {
          const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
          ];
          const color = colors[userId.charCodeAt(0) % colors.length];

          return {
            range: new monacoRef.current.Range(
              cursor.position.lineNumber,
              cursor.position.column,
              cursor.position.lineNumber,
              cursor.position.column
            ),
            options: {
              className: 'cursor-decoration',
              beforeContentClassName: 'cursor-before',
              glyphMarginClassName: 'cursor-glyph',
              stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
              after: {
                content: ` ${cursor.username || 'Anonymous'}`,
                inlineClassName: 'cursor-label',
                inlineClassNameAffectsLetterSpacing: false,
              }
            }
          };
        });

      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newDecorations);
    }
  }, [cursors]);

  // Update editing status decorations
  const updateEditingDecorations = () => {
    if (!editorRef.current || !monacoRef.current) return;

    // Clear old editing decorations
    const currentDecorations = editorRef.current.getModel().getAllDecorations();
    const editingDecorations = currentDecorations.filter(
      d => d.options.glyphMarginClassName === 'editing-status'
    );
    editorRef.current.deltaDecorations(
      editingDecorations.map(d => d.id),
      []
    );

    // Add new editing decorations
    const now = Date.now();
    const activeEditors = Object.entries(editingStatusRef.current)
      .filter(([_, timestamp]) => now - timestamp < 3000) // 3 seconds threshold
      .map(([username]) => username);

    if (activeEditors.length > 0) {
      const firstLineRange = new monacoRef.current.Range(1, 1, 1, 1);
      editorRef.current.deltaDecorations([], [
        {
          range: firstLineRange,
          options: {
            glyphMarginClassName: 'editing-status',
            glyphMargin: {
              position: monacoRef.current.editor.GlyphMarginLane.Left,
              text: `👩‍💻 ${activeEditors.join(', ')} ${activeEditors.length > 1 ? 'are' : 'is'} editing...`,
            },
            stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          }
        }
      ]);
    }

    // Clean up old editing status
    Object.keys(editingStatusRef.current).forEach(username => {
      if (now - editingStatusRef.current[username] > 3000) {
        delete editingStatusRef.current[username];
      }
    });
  };

  // Periodically update editing decorations
  useEffect(() => {
    const interval = setInterval(updateEditingDecorations, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full relative">
      <style jsx>{`
        .cursor-decoration {
          border-left: 2px solid currentColor;
        }
        .cursor-label {
          background: currentColor;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 4px;
        }
        .editing-status {
          color: #4ECDC4;
          font-size: 12px;
          padding-left: 8px;
        }
      `}</style>
      
      <Editor
        height="100%"
        language={language}
        value={code}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          fontSize: 14,
          lineHeight: 22,
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          suggest: {
            showKeywords: true,
            showSnippets: true
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          parameterHints: { enabled: true },
          codeLens: false,
          folding: true,
          foldingHighlight: true,
          unfoldOnClickAfterEndOfLine: true,
          showUnused: true,
          occurrencesHighlight: true,
          selectionHighlight: true,
          hover: { enabled: true },
          contextmenu: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          accessibilitySupport: 'auto',
          glyphMargin: true // Make sure glyph margin is enabled
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;