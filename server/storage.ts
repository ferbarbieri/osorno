import { 
  users, datasets, dataContent, conversations, messages, marketplaceItems,
  type User, type InsertUser, type Dataset, type InsertDataset,
  type DataContent, type InsertDataContent, type Conversation, 
  type InsertConversation, type Message, type InsertMessage,
  type MarketplaceItem, type InsertMarketplaceItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dataset methods
  getDataset(id: number): Promise<Dataset | undefined>;
  getDatasetsByUserId(userId: number): Promise<Dataset[]>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  updateDatasetStatus(id: number, status: string): Promise<Dataset | undefined>;
  
  // DataContent methods
  getDataContent(datasetId: number): Promise<DataContent | undefined>;
  createDataContent(dataContent: InsertDataContent): Promise<DataContent>;
  
  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  getConversationsByDatasetId(datasetId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Message methods
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Marketplace methods
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  
  // Stats methods
  getStats(userId: number): Promise<{ datasets: number, conversations: number, insights: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private datasets: Map<number, Dataset>;
  private dataContents: Map<number, DataContent>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private marketplaceItems: Map<number, MarketplaceItem>;
  
  private userId: number;
  private datasetId: number;
  private dataContentId: number;
  private conversationId: number;
  private messageId: number;
  private marketplaceItemId: number;
  
  constructor() {
    this.users = new Map();
    this.datasets = new Map();
    this.dataContents = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.marketplaceItems = new Map();
    
    this.userId = 1;
    this.datasetId = 1;
    this.dataContentId = 1;
    this.conversationId = 1;
    this.messageId = 1;
    this.marketplaceItemId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: this.userId++,
      username: 'demo',
      password: 'password'
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo datasets
    const datasets = [
      {
        id: this.datasetId++,
        name: 'Customer Sales Data Q2 2023',
        userId: demoUser.id,
        fileType: 'csv',
        status: 'processed',
        rowCount: 12543,
        columns: ['date', 'customer_id', 'product', 'amount', 'region'],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: this.datasetId++,
        name: 'Marketing Campaign Results',
        userId: demoUser.id,
        fileType: 'excel',
        status: 'processed',
        rowCount: 5128,
        columns: ['campaign_id', 'date', 'channel', 'spend', 'clicks', 'conversions'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    
    datasets.forEach(ds => this.datasets.set(ds.id, ds));

    // Create demo marketplace items
    const marketplaceItems = [
      {
        id: this.marketplaceItemId++,
        title: 'Dados de Comportamento do Consumidor no Varejo',
        description: 'Dataset abrangente com padrões de comportamento do consumidor em mais de 50 categorias de varejo.',
        category: 'Varejo & E-commerce',
        price: 'R$ 2.500',
        rating: 4.5,
        userId: demoUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.marketplaceItemId++,
        title: 'Tendências do Mercado Financeiro 2024',
        description: 'Dados do mercado de ações, tendências de criptomoedas e indicadores econômicos.',
        category: 'Finanças & Investimentos',
        price: 'R$ 1.800',
        rating: 4.2,
        userId: demoUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.marketplaceItemId++,
        title: 'Dataset de Analytics de Saúde',
        description: 'Dados anonimizados de pacientes, resultados de tratamentos e performance de instituições de saúde.',
        category: 'Saúde & Medicina',
        price: 'R$ 3.200',
        rating: 4.8,
        userId: demoUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.marketplaceItemId++,
        title: 'Métricas de Engajamento em Redes Sociais',
        description: 'Padrões de engajamento de usuários, performance de conteúdo e analytics de redes sociais.',
        category: 'Marketing & Redes Sociais',
        price: 'R$ 950',
        rating: 4.0,
        userId: demoUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    marketplaceItems.forEach(item => this.marketplaceItems.set(item.id, item));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Dataset methods
  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }
  
  async getDatasetsByUserId(userId: number): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).filter(
      (dataset) => dataset.userId === userId
    );
  }
  
  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.datasetId++;
    const now = new Date();
    const dataset: Dataset = { 
      ...insertDataset, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.datasets.set(id, dataset);
    return dataset;
  }
  
  async updateDatasetStatus(id: number, status: string): Promise<Dataset | undefined> {
    const dataset = this.datasets.get(id);
    if (!dataset) return undefined;
    
    const updatedDataset = { 
      ...dataset, 
      status, 
      updatedAt: new Date() 
    };
    this.datasets.set(id, updatedDataset);
    return updatedDataset;
  }
  
  // DataContent methods
  async getDataContent(datasetId: number): Promise<DataContent | undefined> {
    return Array.from(this.dataContents.values()).find(
      (content) => content.datasetId === datasetId
    );
  }
  
  async createDataContent(insertDataContent: InsertDataContent): Promise<DataContent> {
    const id = this.dataContentId++;
    const dataContent: DataContent = { ...insertDataContent, id };
    this.dataContents.set(id, dataContent);
    return dataContent;
  }
  
  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }
  
  async getConversationsByDatasetId(datasetId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.datasetId === datasetId
    );
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const now = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  // Message methods
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.conversationId === conversationId
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp: now 
    };
    this.messages.set(id, message);
    return message;
  }
  
  // Marketplace methods
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values());
  }
  
  async getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined> {
    return this.marketplaceItems.get(id);
  }
  
  async createMarketplaceItem(insertItem: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const id = this.marketplaceItemId++;
    const now = new Date();
    const item: MarketplaceItem = { 
      ...insertItem, 
      id, 
      createdAt: now 
    };
    this.marketplaceItems.set(id, item);
    return item;
  }
  
  // Stats methods
  async getStats(userId: number): Promise<{ datasets: number, conversations: number, insights: number }> {
    const userDatasets = await this.getDatasetsByUserId(userId);
    const userConversations = await this.getConversationsByUserId(userId);
    
    // In a real app, insights might be tracked separately
    // For now, we'll use message count as a proxy for insights
    let insightCount = 0;
    for (const conversation of userConversations) {
      const messages = await this.getMessagesByConversationId(conversation.id);
      // Count AI responses as insights
      insightCount += messages.filter(m => !m.isUser).length;
    }
    
    return {
      datasets: userDatasets.length,
      conversations: userConversations.length,
      insights: insightCount > 0 ? insightCount : 126 // Default for demo
    };
  }
}

export const storage = new MemStorage();
