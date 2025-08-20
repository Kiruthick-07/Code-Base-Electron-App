import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint for DeepSeek-Coder integration
app.post('/chat', async (req, res) => {
  try {
    const { message, code, language } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare the system message
    const systemMessage = `Your name is BlackFrame, an AI coding assistant integrated into a code editor. 
Your role is to help developers with:
- Code review and suggestions
- Bug fixes and debugging
- Code optimization and refactoring
- Best practices and patterns
- Explaining complex code concepts

Always provide clear, concise, and actionable responses. When suggesting code changes, ensure the code is production-ready and follows best practices.
If you're suggesting a fix, provide the complete corrected code snippet.`;

    // Prepare the user message with code context if provided
    let userMessage = message;
    if (code) {
      userMessage = `Code context (${language || 'unknown language'}):
\`\`\`${language || ''}
${code}
\`\`\`

User question: ${message}`;
    }

    // Prepare the request payload for Ollama
    const ollamaPayload = {
      model: "deepseek-coder:1.3b",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2048
      }
    };

    // Send request to Ollama
    const ollamaResponse = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaPayload),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    // Extract the assistant's response
    const assistantResponse = ollamaData.choices?.[0]?.message?.content || 'No response received';
    
    res.json({
      success: true,
      response: assistantResponse,
      model: ollamaData.model,
      usage: ollamaData.usage
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DeepSeek-Coder backend server running on port ${PORT}`);
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

export default app;
