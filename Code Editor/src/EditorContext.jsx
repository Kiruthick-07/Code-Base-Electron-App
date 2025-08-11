import React, { createContext, useContext, useRef } from 'react';

const EditorContext = createContext({
  setEditorInstance: () => {},
  insertComponentWithImport: async () => {},
});

export function EditorProvider({ children }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const setEditorInstance = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
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
    const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
    editor.executeEdits('insert-snippet', [
      { range, text: code, forceMoveMarkers: true },
    ]);
    const endColumn = position.column + code.length;
    editor.setSelection(new monaco.Selection(position.lineNumber, endColumn, position.lineNumber, endColumn));
    editor.focus();
  };

  const insertComponentWithImport = async ({ jsx, importStatement }) => {
    ensureImportPresent(importStatement);
    insertAtCursor(jsx);
  };

  return (
    <EditorContext.Provider value={{ setEditorInstance, insertComponentWithImport }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}


