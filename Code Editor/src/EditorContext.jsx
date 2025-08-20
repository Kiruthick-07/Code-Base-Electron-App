import React, { createContext, useContext, useRef } from 'react';

const EditorContext = createContext({
  setEditorInstance: () => {},
  insertComponentWithImport: async () => {},
  insertSnippetAtCursor: () => {},
});

export function EditorProvider({ children }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const setEditorInstance = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Expose editor globally for ChatPanel access
    if (typeof window !== 'undefined') {
      window.monacoEditor = editor;
      window.monaco = monaco;
    }
  };

  const ensureImportPresent = (importStatement) => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    const value = model.getValue();
    if (value.includes(importStatement.trim())) return;

    const insertText = importStatement.endsWith('\n') ? importStatement : importStatement + '\n';
    editor.executeEdits('insert-import', [
      {
        range: new monacoRef.current.Range(1, 1, 1, 1),
        text: insertText,
        forceMoveMarkers: true,
      },
    ]);
  };

  const insertAtCursor = (code) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const position = editor.getPosition();
    const range = new monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    );
    editor.executeEdits('insert-snippet', [{ range, text: code, forceMoveMarkers: true }]);
    const lines = code.split('\n');
    const lastLine = lines[lines.length - 1];
    const endLine = position.lineNumber + lines.length - 1;
    // Columns are 1-based. For multi-line insert, end column should be the length of the last line + 1
    const endColumn = lines.length === 1 ? position.column + lastLine.length : lastLine.length + 1;
    editor.setSelection(new monaco.Selection(endLine, endColumn, endLine, endColumn));
    editor.focus();
  };

  const insertSnippetAtCursor = (rawCode) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const position = editor.getPosition();
    const baseIndent = ' '.repeat(Math.max(position.column - 1, 0));
    const lines = rawCode.split('\n');
    const indented = lines
      .map((line, idx) => (idx === 0 ? line : baseIndent + line))
      .join('\n');
    insertAtCursor(indented);
  };

  const insertComponentWithImport = async ({ jsx, importStatement }) => {
    ensureImportPresent(importStatement);
    insertAtCursor(jsx);
  };

  return (
    <EditorContext.Provider value={{ setEditorInstance, insertComponentWithImport, insertSnippetAtCursor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}


