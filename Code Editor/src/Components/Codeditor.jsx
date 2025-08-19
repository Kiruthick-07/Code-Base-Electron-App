import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorContext } from '../EditorContext';
 

const Codeditor = ({ openTabs, activeTab, setActiveTab, onCloseTab, setOpenTabs }) => {
  const editorOptions = {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    quickSuggestions: { other: true, comments: true, strings: true },
    suggestOnTriggerCharacters: true,
    quickSuggestionsDelay: 50,
    snippetSuggestions: 'top',
    wordBasedSuggestions: true,
    tabCompletion: 'on',
  };

 
  const activeFile = openTabs.find(tab => tab.path === activeTab);
  const { setEditorInstance } = useEditorContext();
  const completionProviderDisposableRef = useRef([]);

  const getLanguageForPath = (filePath) => {
    if (!filePath) return 'javascript';
    const parts = filePath.split('.');
    const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'html' || ext === 'htm') return 'html';
    if (ext === 'css') return 'css';
    return 'javascript';
  };
  const editorLanguage = getLanguageForPath(activeFile?.path);

  return (
    <div className="vsc-editor-outer">
      {/* Tab bar */}
      <div className="vsc-tabbar">
        {openTabs.map(tab => (
          <div
            key={tab.path}
            className={`vsc-tab${activeTab === tab.path ? ' vsc-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.path)}
          >
            <span className="vsc-tab-label">{tab.name}</span>
            <span className="vsc-tab-close" onClick={(e) => { e.stopPropagation(); onCloseTab(tab.path); }}>×</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="vsc-editor-inner">
        {activeFile ? (
          <Editor
            height="100%"
            theme="vs-dark"
            language={editorLanguage}
            value={activeFile.content}
            onMount={(editor, monaco) => {
              setEditorInstance(editor, monaco);
              // ensure desired suggestion behavior
              editor.updateOptions({
                quickSuggestions: { other: true, comments: true, strings: true },
                suggestOnTriggerCharacters: true,
                quickSuggestionsDelay: 50,
                snippetSuggestions: 'top',
                wordBasedSuggestions: true,
                tabCompletion: 'on',
              });

              // dispose any previous providers to avoid duplicates
              if (Array.isArray(completionProviderDisposableRef.current)) {
                completionProviderDisposableRef.current.forEach(d => {
                  try { d && d.dispose && d.dispose(); } catch (e) {}
                });
                completionProviderDisposableRef.current = [];
              }

              const jsProvider = monaco.languages.registerCompletionItemProvider('javascript', {
                triggerCharacters: ['.', '(', '[', '"', '\'', '`'],
                provideCompletionItems: (model, position) => {
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  };

                  const suggestions = [
                    {
                      label: 'console.log()',
                      kind: monaco.languages.CompletionItemKind.Function,
                      insertText: 'console.log(${1:value});',
                      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      detail: 'Log output to the console',
                      range,
                    },
                    {
                      label: 'console.error()',
                      kind: monaco.languages.CompletionItemKind.Function,
                      insertText: 'console.error(${1:error});',
                      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      detail: 'Log error to the console',
                      range,
                    },
                    {
                      label: 'console.warn()',
                      kind: monaco.languages.CompletionItemKind.Function,
                      insertText: 'console.warn(${1:warning});',
                      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      detail: 'Log warning to the console',
                      range,
                    },
                    {
                      label: 'function',
                      kind: monaco.languages.CompletionItemKind.Snippet,
                      insertText: 'function ${1:name}(${2:params}) {\n\t${3:// body}\n}',
                      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      detail: 'Function snippet',
                      range,
                    },
                  ];

                  return { suggestions };
                },
              });

              const htmlTags = [
                'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'button', 'input', 'textarea',
                'label', 'form', 'header', 'footer', 'nav', 'section', 'article', 'main', 'aside',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
              ];
              const htmlProvider = monaco.languages.registerCompletionItemProvider('html', {
                triggerCharacters: ['<', '/', ' '],
                provideCompletionItems: (model, position) => {
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  };
                  const tagSuggestions = htmlTags.map(tag => ({
                    label: `<${tag}>`,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: `<${tag}>$0</${tag}>`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: `HTML <${tag}> tag`,
                    range,
                  }));
                  tagSuggestions.push({
                    label: '<img />',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '<img src="${1:src}" alt="${2:alt}" />',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'HTML <img> tag',
                    range,
                  });
                  tagSuggestions.push({
                    label: '<input />',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: '<input type="${1:text}" placeholder="${2:placeholder}" />',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'HTML <input> tag',
                    range,
                  });
                  return { suggestions: tagSuggestions };
                },
              });

              const cssProperties = [
                { prop: 'display', value: 'flex' },
                { prop: 'justify-content', value: 'center' },
                { prop: 'align-items', value: 'center' },
                { prop: 'color', value: '#333' },
                { prop: 'background-color', value: '#fff' },
                { prop: 'margin', value: '0' },
                { prop: 'padding', value: '0' },
                { prop: 'font-size', value: '16px' },
                { prop: 'width', value: '100%' },
                { prop: 'height', value: '100%' },
              ];
              const cssProvider = monaco.languages.registerCompletionItemProvider('css', {
                triggerCharacters: ['-', ':'],
                provideCompletionItems: (model, position) => {
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  };
                  const propSuggestions = cssProperties.map(({ prop, value }) => ({
                    label: `${prop}:`,
                    kind: monaco.languages.CompletionItemKind.Property,
                    insertText: `${prop}: ${value};`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: 'CSS property',
                    range,
                  }));
                  return { suggestions: propSuggestions };
                },
              });

              completionProviderDisposableRef.current = [jsProvider, htmlProvider, cssProvider];
              editor.focus();
            }}
            onUnmount={() => {
              if (Array.isArray(completionProviderDisposableRef.current)) {
                completionProviderDisposableRef.current.forEach(d => {
                  try { d && d.dispose && d.dispose(); } catch (e) {}
                });
                completionProviderDisposableRef.current = [];
              }
            }}
            onChange={(newValue) => {
              setOpenTabs(prev =>
                prev.map(tab =>
                  tab.path === activeFile.path ? { ...tab, content: newValue } : tab
                )
              );
              if (window.electronAPI && window.electronAPI.saveFile) {
                window.electronAPI.saveFile(activeFile.path, newValue);
              }
            }}
            options={editorOptions}
          />
        ) : (
          <div style={{ color: '#999', padding: 16 }}>Open a file to start editing</div>
        )}
      </div>
    </div>
  );
};

export default Codeditor;