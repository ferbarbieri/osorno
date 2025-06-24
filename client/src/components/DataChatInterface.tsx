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

    // Português: "Mostre-me a receita por mês" ou palavras relacionadas
    if (lowerQuery.includes('receita') || lowerQuery.includes('mês') || lowerQuery.includes('monthly') || lowerQuery.includes('revenue')) {
      return {
        content: "Aqui está a tendência da sua receita mensal. Posso ver que maio e dezembro foram seus meses mais fortes, com maio atingindo R$ 401K e dezembro chegando a R$ 492K. Há uma clara tendência de crescimento ao longo do ano com 15,2% de crescimento comparado ao ano passado.",
        chartData: [
          { month: 'Jan', revenue: 245000 },
          { month: 'Fev', revenue: 198000 },
          { month: 'Mar', revenue: 312000 },
          { month: 'Abr', revenue: 289000 },
          { month: 'Mai', revenue: 401000 },
          { month: 'Jun', revenue: 378000 },
          { month: 'Jul', revenue: 423000 },
          { month: 'Ago', revenue: 395000 },
          { month: 'Set', revenue: 445000 },
          { month: 'Out', revenue: 421000 },
          { month: 'Nov', revenue: 467000 },
          { month: 'Dez', revenue: 492000 }
        ],
        chartType: 'line'
      };
    }

    // Português: "Qual região está tendo melhor desempenho?"
    if (lowerQuery.includes('região') || lowerQuery.includes('region') || lowerQuery.includes('desempenho') || lowerQuery.includes('performance')) {
      return {
        content: "O desempenho regional mostra a América do Norte liderando com R$ 1,25M em vendas e 15,2% de crescimento. A Ásia-Pacífico é sua região de crescimento mais rápido com 22,1% de crescimento e R$ 756K em vendas. A América Latina precisa de atenção com declínio de -3,4%.",
        chartData: [
          { region: 'América do Norte', sales: 1250000 },
          { region: 'Europa', sales: 980000 },
          { region: 'Ásia-Pacífico', sales: 756000 },
          { region: 'América Latina', sales: 340000 },
          { region: 'Oriente Médio', sales: 189000 }
        ],
        chartType: 'bar'
      };
    }

    // Português: "Qual é a divisão do nosso mix de produtos?"
    if (lowerQuery.includes('produto') || lowerQuery.includes('mix') || lowerQuery.includes('divisão') || lowerQuery.includes('category')) {
      return {
        content: "Licenças de Software dominam seu mix de produtos com 45% da receita (R$ 2,1M), seguido por Serviços Profissionais com 25% (R$ 1,17M). Treinamento representa o menor segmento, mas oferece oportunidades de crescimento.",
        chartData: [
          { name: 'Licenças de Software', value: 45, revenue: 2100000 },
          { name: 'Serviços Profissionais', value: 25, revenue: 1175000 },
          { name: 'Suporte e Manutenção', value: 20, revenue: 940000 },
          { name: 'Treinamento', value: 10, revenue: 470000 }
        ],
        chartType: 'pie'
      };
    }

    // Português: "Quem são nossos melhores performers?"
    if (lowerQuery.includes('melhor') || lowerQuery.includes('performer') || lowerQuery.includes('top') || lowerQuery.includes('quem')) {
      return {
        content: "Sarah Johnson é sua melhor vendedora com R$ 850K em receita de 45 negócios, atingindo 120% da meta. Mike Chen e Emily Rodriguez também estão superando as metas. Considere analisar o que torna estes vendedores bem-sucedidos e escalar essas práticas.",
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

    // Português: "Você pode prever o próximo trimestre?"
    if (lowerQuery.includes('prever') || lowerQuery.includes('próximo') || lowerQuery.includes('trimestre') || lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
      return {
        content: "Com base nas tendências atuais, prevejo que a receita do Q1 2025 chegará a R$ 1,35M, representando 18% de crescimento. O modelo considera padrões sazonais, velocidade do pipeline e condições de mercado. Os principais impulsionadores incluem presença expandida na Ásia-Pacífico e novos lançamentos de produtos.",
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

    // Português: "O que está impulsionando nosso crescimento?"
    if (lowerQuery.includes('impulsionando') || lowerQuery.includes('crescimento') || lowerQuery.includes('driving') || lowerQuery.includes('growth')) {
      return {
        content: "Seu crescimento está sendo impulsionado principalmente por três fatores: (1) Expansão no segmento enterprise (+28%), (2) Aumento do ticket médio (+15,7%), e (3) Melhoria na retenção de clientes (95%). A estratégia de upselling tem sido particularmente efetiva, gerando 34% mais receita por cliente existente."
      };
    }

    // Respostas padrão para várias perguntas de negócio
    const defaultResponses = [
      "Com base nos seus dados, noto alguns padrões interessantes. Sua taxa de conversão diminuiu ligeiramente para 20%, mas o tamanho médio do negócio aumentou 5,7% para R$ 16,9K. Isso sugere que você está fechando menos negócios, mas de maior valor.",
      "Sua equipe de vendas está tendo um bom desempenho geral. Os dados mostram crescimento consistente na maioria das métricas, com desempenho particularmente forte no segmento enterprise.",
      "Observando suas tendências de aquisição de clientes, houve uma mudança para clientes de maior valor. Isso se alinha com sua estratégia de posicionamento premium.",
      "Os dados indicam padrões sazonais em seu negócio, com Q4 tradicionalmente sendo seu trimestre mais forte. Considere ajustar seus modelos de previsão adequadamente."
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
    "Mostre-me a receita por mês",
    "Qual região está tendo melhor desempenho?",
    "Qual é a divisão do nosso mix de produtos?",
    "Quem são nossos melhores performers?",
    "Você pode prever o próximo trimestre?",
    "O que está impulsionando nosso crescimento?"
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
Assistente de Dados IA
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
                      {message.isUser ? 'Você' : 'IA'}
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
                    <AvatarFallback className="bg-gray-100">IA</AvatarFallback>
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
              <p className="text-sm text-gray-600 mb-3">Experimente perguntar:</p>
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
                placeholder="Faça uma pergunta sobre seus dados..."
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