// src/server.ts
import 'dotenv/config'; 
import express from 'express';
import { a2aHandler } from './mastra/index';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// Parse JSON bodies
app.use(express.json());

// CORS for development (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Uptime Monitor A2A API',
    status: 'running',
    endpoints: {
      health: '/health',
      a2a: '/api/a2a'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// A2A endpoint for Telex
app.post('/api/a2a', async (req, res) => {
  try {
    console.log('📨 Received A2A request:', JSON.stringify(req.body, null, 2));
    
    // Call the A2A handler
    const response = await a2aHandler(req);
    const data = await response.json();
    
    console.log('📤 Sending A2A response:', JSON.stringify(data, null, 2));
    
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('❌ A2A handler error:', error);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || "error",
      error: {
        code: -32000,
        message: error.message || "Internal server error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    availableEndpoints: ['/', '/health', '/api/a2a']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Uptime Monitor API Server Started');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 A2A Endpoint: http://localhost:${PORT}/api/a2a`);
  console.log('✅ Ready to receive requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});