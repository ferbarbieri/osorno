import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  chartData?: any[];
  chartType?: string;
}

interface DataChatInterfaceProps {
  onClose: () => void;
}

export default function DataChatInterface({ onClose }: DataChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá! Sou seu analista de dados com IA. Posso ajudá-lo a explorar seus dados de vendas e responder perguntas sobre o desempenho do seu negócio. O que gostaria de saber?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMockResponse = (query: string): { content: string; chartData?: any[]; chartType?: string } => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales by month')) {
      return {
        content: "Here's your monthly revenue trend. I can see that May and December were your strongest months, with May hitting $401K and December reaching $492K. There's a clear upward trend throughout the year with a 15.2% growth compared to last year.",
        chartData: [
          { month: 'Jan', revenue: 245000 },
          { month: 'Feb', revenue: 198000 },
          { month: 'Mar', revenue: 312000 },
          { month: 'Apr', revenue: 289000 },
          { month: 'May', revenue: 401000 },
          { month: 'Jun', revenue: 378000 },
          { month: 'Jul', revenue: 423000 },
          { month: 'Aug', revenue: 395000 },
          { month: 'Sep', revenue: 445000 },
          { month: 'Oct', revenue: 421000 },
          { month: 'Nov', revenue: 467000 },
          { month: 'Dec', revenue: 492000 }
        ],
        chartType: 'line'
      };
    }

    if (lowerQuery.includes('region') || lowerQuery.includes('geographic')) {
      return {
        content: "Your regional performance shows North America leading with $1.25M in sales and 15.2% growth. Asia Pacific is your fastest growing region at 22.1% growth with $756K in sales. Latin America needs attention with a -3.4% decline.",
        chartData: [
          { region: 'North America', sales: 1250000 },
          { region: 'Europe', sales: 980000 },
          { region: 'Asia Pacific', sales: 756000 },
          { region: 'Latin America', sales: 340000 },
          { region: 'Middle East', sales: 189000 }
        ],
        chartType: 'bar'
      };
    }

    if (lowerQuery.includes('product') || lowerQuery.includes('category')) {
      return {
        content: "Software Licenses dominate your product mix at 45% of revenue ($2.1M), followed by Professional Services at 25% ($1.17M). Training represents the smallest segment but offers growth opportunities.",
        chartData: [
          { name: 'Software Licenses', value: 45, revenue: 2100000 },
          { name: 'Professional Services', value: 25, revenue: 1175000 },
          { name: 'Support & Maintenance', value: 20, revenue: 940000 },
          { name: 'Training', value: 10, revenue: 470000 }
        ],
        chartType: 'pie'
      };
    }

    if (lowerQuery.includes('top') || lowerQuery.includes('best') || lowerQuery.includes('performer')) {
      return {
        content: "Sarah Johnson is your top performer with $850K in revenue from 45 deals, achieving 120% of quota. Mike Chen and Emily Rodriguez are also exceeding targets. Consider analyzing what makes these reps successful and scaling those practices.",
        chartData: [
          { name: 'Sarah Johnson', revenue: 850000, quota: 120 },
          { name: 'Mike Chen', revenue: 720000, quota: 95 },
          { name: 'Emily Rodriguez', revenue: 680000, quota: 105 },
          { name: 'David Kim', revenue: 590000, quota: 88 },
          { name: 'Lisa Thompson', revenue: 520000, quota: 78 }
        ],
        chartType: 'bar'
      };
    }

    if (lowerQuery.includes('forecast') || lowerQuery.includes('predict') || lowerQuery.includes('next')) {
      return {
        content: "Based on current trends, I predict Q1 2025 revenue will reach $1.35M, representing 18% growth. The model considers seasonal patterns, pipeline velocity, and market conditions. Key drivers include expanded Asia Pacific presence and new product launches.",
        chartData: [
          { quarter: 'Q1 2024', actual: 755000, predicted: null },
          { quarter: 'Q2 2024', actual: 1068000, predicted: null },
          { quarter: 'Q3 2024', actual: 1263000, predicted: null },
          { quarter: 'Q4 2024', actual: 1380000, predicted: null },
          { quarter: 'Q1 2025', actual: null, predicted: 1350000 },
          { quarter: 'Q2 2025', actual: null, predicted: 1420000 }
        ],
        chartType: 'line'
      };
    }

    // Default responses for various business questions
    const defaultResponses = [
      "Based on your data, I notice some interesting patterns. Your conversion rate has decreased slightly to 20%, but your average deal size increased by 5.7% to $16.9K. This suggests you're closing fewer but higher-value deals.",
      "Your sales team is performing well overall. The data shows consistent growth across most metrics, with particularly strong performance in the enterprise segment.",
      "Looking at your customer acquisition trends, there's been a shift toward higher-value customers. This aligns with your premium positioning strategy.",
      "The data indicates seasonal patterns in your business, with Q4 traditionally being your strongest quarter. Consider adjusting your forecasting models accordingly."
    ];

    return {
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateMockResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        chartData: response.chartData,
        chartType: response.chartType
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Show me revenue by month",
    "Which region is performing best?",
    "What's our product mix breakdown?",
    "Who are our top performers?",
    "Can you forecast next quarter?",
    "What's driving our growth?"
  ];

  const renderChart = (message: Message) => {
    if (!message.chartData || !message.chartType) return null;

    const COLORS = ['#FF7A00', '#6B7280', '#F59E0B', '#EF4444', '#8B5CF6'];

    switch (message.chartType) {
      case 'bar':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(message.chartData[0])[0]} />
                <YAxis />
                <Tooltip formatter={(value) => typeof value === 'number' && value > 1000 ? `$${(value as number).toLocaleString()}` : value} />
                <Bar dataKey={Object.keys(message.chartData[0])[1]} fill="#FF7A00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(message.chartData[0])[0]} />
                <YAxis />
                <Tooltip formatter={(value) => typeof value === 'number' && value > 1000 ? `$${(value as number).toLocaleString()}` : value} />
                <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={message.chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {message.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <i className="ri-robot-line text-primary mr-2"></i>
              AI Data Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <i className="ri-close-line"></i>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className={message.isUser ? 'bg-primary text-white' : 'bg-gray-100'}>
                      {message.isUser ? 'You' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`mx-3 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                    {renderChart(message)}
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gray-100">AI</AvatarFallback>
                  </Avatar>
                  <div className="mx-3">
                    <div className="inline-block p-3 rounded-lg bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="border-t p-4">
              <p className="text-sm text-gray-600 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your data..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <i className="ri-send-plane-line"></i>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}