import express from 'express';
import { a2aHandler } from './mastra/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// A2A endpoint for Telex
app.post('/api/a2a', async (req, res) => {
  try {
    console.log('Received A2A request:', JSON.stringify(req.body, null, 2));
    
    const response = await a2aHandler(req);
    const data = await response.json();
    
    console.log('Sending A2A response:', JSON.stringify(data, null, 2));
    
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('A2A handler error:', error);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || "error",
      error: {
        code: -32000,
        message: error.message || "Internal server error"
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Uptime Monitor API running on port ${PORT}`);
  console.log(`📡 A2A endpoint: http://localhost:${PORT}/api/a2a`);
});