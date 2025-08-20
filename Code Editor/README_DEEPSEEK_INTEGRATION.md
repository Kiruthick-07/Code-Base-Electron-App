# DeepSeek-Coder Integration with Electron Code Editor

This project integrates DeepSeek-Coder running on Ollama into your Electron + React + Monaco code editor, providing AI-powered coding assistance directly within the editor.

## Features

- 🤖 **AI Chat Interface**: Chat with DeepSeek-Coder about your code
- 📝 **Code Context**: Automatically includes selected code in your questions
- 💾 **Apply Fixes**: One-click application of AI-suggested code fixes
- 🎨 **Modern UI**: Clean, VS Code-inspired chat interface
- 🔄 **Real-time**: Instant responses from your local Ollama instance

## Prerequisites

1. **Ollama**: Must be installed and running locally
2. **DeepSeek-Coder Model**: The `deepseek-coder:1.3b` model must be pulled

### Installing Ollama

Visit [ollama.ai](https://ollama.ai) and follow the installation instructions for your platform.

### Pulling the DeepSeek-Coder Model

```bash
ollama pull deepseek-coder:1.3b
```

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the project directory and install the backend dependencies:

```bash
cd "Code-Base-Electron-App/Code Editor"
npm install express cors node-fetch
```

### 2. Start the Backend Server

Start the Express backend server:

```bash
node server.js
```

The server will start on port 3001. You should see:
```
🚀 DeepSeek-Coder backend server running on port 3001
📡 Chat endpoint: http://localhost:3001/chat
🔍 Health check: http://localhost:3001/health
```

### 3. Start the Frontend

In a new terminal, start the React frontend:

```bash
npm run dev
```

### 4. Verify Ollama is Running

Ensure Ollama is running and accessible at `http://localhost:11434`. You can test this by visiting the health check endpoint:

```bash
curl http://localhost:3001/health
```

## Usage

### Opening the Chat Panel

1. Click the floating chat button (💬) in the bottom-right corner of the editor
2. The chat panel will slide in from the right side

### Using the AI Assistant

1. **Ask Questions**: Type your question in the chat input
2. **Include Code Context**: Select code in the editor before asking questions for better responses
3. **Apply Fixes**: Click the "💾 Apply Fix" button to insert AI-suggested code directly into the editor

### Example Interactions

- **Code Review**: "Can you review this function for potential bugs?"
- **Bug Fixing**: "There's an error in this code, can you help fix it?"
- **Optimization**: "How can I make this code more efficient?"
- **Best Practices**: "Is this the right way to implement this pattern?"

## Architecture

### Backend (`server.js`)
- Express server with CORS enabled
- `/chat` endpoint that communicates with Ollama API
- Handles message formatting and system prompts
- Error handling and response validation

### Frontend (`ChatPanel.jsx`)
- React component with modern UI design
- Integrates with Monaco editor for code selection
- Real-time chat interface with message history
- Code application functionality

### Integration Points
- **EditorContext**: Exposes Monaco editor instance globally
- **Monaco Editor**: Provides code selection and insertion capabilities
- **Ollama API**: Local AI model for code assistance

## Configuration

### Backend Configuration

You can modify the following in `server.js`:

- **Port**: Change `PORT` variable (default: 3001)
- **Model**: Update `model` in the Ollama payload
- **Temperature**: Adjust `temperature` for response creativity (0.0 - 1.0)
- **Max Tokens**: Modify `max_tokens` for response length

### Frontend Configuration

Chat panel appearance can be customized in `ChatPanel.css`:

- Panel width (default: 400px)
- Colors and themes
- Animations and transitions

## Troubleshooting

### Common Issues

1. **"Ollama API error"**
   - Ensure Ollama is running: `ollama serve`
   - Verify the model is pulled: `ollama list`
   - Check Ollama is accessible at `http://localhost:11434`

2. **"Failed to get response"**
   - Check backend server is running on port 3001
   - Verify CORS is properly configured
   - Check browser console for network errors

3. **Chat panel not appearing**
   - Ensure the ChatPanel component is properly imported
   - Check for JavaScript errors in browser console
   - Verify the toggle button is rendered

4. **Code selection not working**
   - Ensure Monaco editor is properly initialized
   - Check that `window.monacoEditor` is available
   - Verify the editor context is properly set up

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'true');
```

## Development

### Adding New Features

1. **New Chat Commands**: Extend the system prompt in `server.js`
2. **UI Enhancements**: Modify `ChatPanel.css` and component structure
3. **Editor Integration**: Add new functions to `EditorContext.jsx`

### Testing

1. **Backend**: Test the `/chat` endpoint with Postman or curl
2. **Frontend**: Use browser dev tools to test chat functionality
3. **Integration**: Verify code selection and application works correctly

## Production Considerations

- **Security**: Implement authentication for production use
- **Rate Limiting**: Add request throttling to prevent abuse
- **Logging**: Implement proper logging for monitoring
- **Error Handling**: Add comprehensive error handling and user feedback
- **Performance**: Optimize for large codebases and long conversations

## License

This integration is provided as-is for educational and development purposes.

## Support

For issues related to:
- **Ollama**: Visit [ollama.ai](https://ollama.ai)
- **DeepSeek-Coder**: Check the model documentation
- **This Integration**: Review the troubleshooting section above
