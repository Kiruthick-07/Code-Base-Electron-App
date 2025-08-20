import React, { useState, useRef, useEffect } from 'react';
import { useEditorContext } from '../EditorContext';
import './ChatPanel.css';

const ChatPanel = ({ isVisible, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const messagesEndRef = useRef(null);
  const { insertSnippetAtCursor } = useEditorContext();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get selected text from Monaco editor
  const getSelectedText = () => {
    if (window.monacoEditor) {
      const selection = window.monacoEditor.getSelection();
      if (selection && !selection.isEmpty()) {
        const model = window.monacoEditor.getModel();
        const text = model.getValueInRange(selection);
        const language = window.monacoEditor.getModel()?.getLanguageId() || 'javascript';
        setSelectedCode(text);
        setSelectedLanguage(language);
        return { text, language };
      }
    }
    return { text: '', language: '' };
  };

  // Send message to DeepSeek-Coder backend
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const { text: code, language } = getSelectedText();
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString(),
      code: code || null
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          code: code || null,
          language: language || 'javascript'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString(),
          model: data.model
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply the suggested code fix to the editor
  const applyFix = (codeContent) => {
    if (!codeContent) return;
    
    // Extract code from markdown if present
    let codeToInsert = codeContent;
    const codeBlockMatch = codeContent.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      codeToInsert = codeBlockMatch[1];
    }
    
    if (codeToInsert.trim()) {
      insertSnippetAtCursor(codeToInsert);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format message content with syntax highlighting
  const formatMessageContent = (content) => {
    // Simple markdown-like formatting for code blocks
    const formattedContent = content
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'text';
        return `<div class="code-block">
          <div class="code-header">${language}</div>
          <pre><code class="language-${language}">${code}</code></pre>
        </div>`;
      })
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    return { __html: formattedContent };
  };

  if (!isVisible) return null;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>🤖 DeepSeek-Coder Assistant</h3>
        <button className="close-btn" onClick={onToggle}>×</button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">🚀</div>
            <h4>Welcome to DeepSeek-Coder!</h4>
            <p>I'm your AI coding assistant. I can help you with:</p>
            <ul>
              <li>Code review and suggestions</li>
              <li>Bug fixes and debugging</li>
              <li>Code optimization</li>
              <li>Best practices</li>
            </ul>
            <p><strong>Tip:</strong> Select code in the editor before asking questions for better context!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-header">
              <span className="message-type">
                {message.type === 'user' ? '👤 You' : 
                 message.type === 'assistant' ? '🤖 Assistant' : '❌ Error'}
              </span>
              <span className="message-time">{message.timestamp}</span>
            </div>
            
            <div className="message-content">
              {message.type === 'user' && message.code && (
                <div className="selected-code-preview">
                  <div className="code-preview-header">Selected Code:</div>
                  <pre><code>{message.code}</code></pre>
                </div>
              )}
              
              <div 
                className="message-text"
                dangerouslySetInnerHTML={formatMessageContent(message.content)}
              />
              
              {message.type === 'assistant' && (
                <button 
                  className="apply-fix-btn"
                  onClick={() => applyFix(message.content)}
                  title="Apply this code suggestion to the editor"
                >
                  💾 Apply Fix
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-header">
              <span className="message-type">🤖 Assistant</span>
              <span className="message-time">Now</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your code... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={1}
            className="message-input"
          />
          <button 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        
        {selectedCode && (
          <div className="code-context-indicator">
            📝 Code selected: {selectedCode.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
