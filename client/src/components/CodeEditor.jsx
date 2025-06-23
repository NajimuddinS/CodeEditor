import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = forwardRef(({ code, language, onChange, onCursorChange, cursors }, ref) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

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
          // Ensure cursor and cursor.position are defined
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
          accessibilitySupport: 'auto'
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;