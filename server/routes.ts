import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDataset, generateDataResponse, generateMockDataResponse } from "./openai";
import { insertDatasetSchema, insertDataContentSchema, insertConversationSchema, insertMessageSchema, insertMarketplaceItemSchema } from "@shared/schema";
import { z } from "zod";

const parseFile = (fileContent: string, fileType: string): any[] => {
  if (fileType === 'json') {
    return JSON.parse(fileContent);
  }
  
  if (fileType === 'csv') {
    // Basic CSV parser (simplified for demo)
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
  }
  
  // Mock data for unsupported formats (excel, etc.)
  return Array(50).fill(0).map((_, i) => ({
    id: i + 1,
    value: Math.random() * 1000,
    category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
  }));
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  
  // User authentication (simplified for demo)
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find user
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Assign a user session
    if (req.session) {
      req.session.userId = user.id;
    }
    
    return res.status(200).json({ 
      id: user.id,
      username: user.username
    });
  });
  
  // Dataset routes
  app.get('/api/datasets', async (req: Request, res: Response) => {
    const userId = req.session?.userId || 1; // Default to user 1 for demo
    const datasets = await storage.getDatasetsByUserId(userId);
    res.json(datasets);
  });
  
  app.get('/api/datasets/:id', async (req: Request, res: Response) => {
    const datasetId = parseInt(req.params.id);
    const dataset = await storage.getDataset(datasetId);
    
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    
    res.json(dataset);
  });
  
  app.post('/api/datasets', async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId || 1; // Default to user 1 for demo
      
      // Validate the dataset
      const { name, fileType, fileContent } = req.body;
      
      if (!name || !fileType || !fileContent) {
        return res.status(400).json({ message: 'Name, file type, and file content are required' });
      }
      
      // Parse the file content
      const parsedData = parseFile(fileContent, fileType);
      
      // Determine column names and row count
      const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
      const rowCount = parsedData.length;
      
      // Create the dataset
      const result = insertDatasetSchema.safeParse({
        name,
        userId,
        fileType,
        status: 'processing',
        rowCount,
        columns
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid dataset data', errors: result.error });
      }
      
      const dataset = await storage.createDataset(result.data);
      
      // Store the actual data content
      const dataContentResult = insertDataContentSchema.safeParse({
        datasetId: dataset.id,
        content: parsedData
      });
      
      if (!dataContentResult.success) {
        return res.status(400).json({ message: 'Invalid data content', errors: dataContentResult.error });
      }
      
      await storage.createDataContent(dataContentResult.data);
      
      // Analyze the dataset (async, don't wait for it)
      analyzeDataset(parsedData)
        .then(() => {
          // Update the dataset status after analysis
          storage.updateDatasetStatus(dataset.id, 'processed');
        })
        .catch(error => {
          console.error('Error analyzing dataset:', error);
          storage.updateDatasetStatus(dataset.id, 'error');
        });
      
      // Immediately return the created dataset
      res.status(201).json(dataset);
    } catch (error) {
      console.error('Error creating dataset:', error);
      res.status(500).json({ message: 'Error creating dataset' });
    }
  });
  
  // Conversation routes
  app.get('/api/conversations', async (req: Request, res: Response) => {
    const userId = req.session?.userId || 1; // Default to user 1 for demo
    const { datasetId } = req.query;
    
    let conversations;
    if (datasetId) {
      conversations = await storage.getConversationsByDatasetId(parseInt(datasetId as string));
    } else {
      conversations = await storage.getConversationsByUserId(userId);
    }
    
    res.json(conversations);
  });
  
  app.get('/api/conversations/:id', async (req: Request, res: Response) => {
    const conversationId = parseInt(req.params.id);
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const messages = await storage.getMessagesByConversationId(conversationId);
    
    res.json({
      ...conversation,
      messages
    });
  });
  
  app.post('/api/conversations', async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId || 1; // Default to user 1 for demo
      
      const result = insertConversationSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid conversation data', errors: result.error });
      }
      
      const conversation = await storage.createConversation(result.data);
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ message: 'Error creating conversation' });
    }
  });
  
  // Message routes
  app.post('/api/messages', async (req: Request, res: Response) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid message data', errors: result.error });
      }
      
      // Save the user message
      const userMessage = await storage.createMessage(result.data);
      
      // Get the conversation to find the associated dataset
      const conversation = await storage.getConversation(userMessage.conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      // Get the data content for the dataset
      const dataContent = await storage.getDataContent(conversation.datasetId);
      
      // Generate AI response
      let aiResponse;
      if (process.env.OPENAI_API_KEY) {
        // Use OpenAI if API key is available
        aiResponse = await generateDataResponse(userMessage.content, dataContent?.content || []);
      } else {
        // Use mock response for demo
        aiResponse = generateMockDataResponse(userMessage.content);
      }
      
      // Save the AI response message
      const aiMessageResult = insertMessageSchema.safeParse({
        conversationId: userMessage.conversationId,
        isUser: false,
        content: aiResponse.response
      });
      
      if (!aiMessageResult.success) {
        return res.status(400).json({ message: 'Invalid AI message data', errors: aiMessageResult.error });
      }
      
      const aiMessage = await storage.createMessage(aiMessageResult.data);
      
      res.status(201).json({
        userMessage,
        aiMessage,
        chartData: aiResponse.chartData,
        chartType: aiResponse.chartType
      });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Error creating message' });
    }
  });
  
  // Marketplace routes
  app.get('/api/marketplace', async (_req: Request, res: Response) => {
    const items = await storage.getMarketplaceItems();
    res.json(items);
  });
  
  app.get('/api/marketplace/:id', async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    const item = await storage.getMarketplaceItem(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Marketplace item not found' });
    }
    
    res.json(item);
  });
  
  app.post('/api/marketplace', async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId || 1; // Default to user 1 for demo
      
      const result = insertMarketplaceItemSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid marketplace item data', errors: result.error });
      }
      
      const item = await storage.createMarketplaceItem(result.data);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating marketplace item:', error);
      res.status(500).json({ message: 'Error creating marketplace item' });
    }
  });
  
  // Stats route
  app.get('/api/stats', async (req: Request, res: Response) => {
    const userId = req.session?.userId || 1; // Default to user 1 for demo
    const stats = await storage.getStats(userId);
    res.json(stats);
  });

  const httpServer = createServer(app);

  return httpServer;
}
