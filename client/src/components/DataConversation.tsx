import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Conversation, type Message } from "@shared/schema";

type ConversationProps = {
  datasetId?: number;
};

export default function DataConversation({ datasetId }: ConversationProps) {
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartType, setChartType] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations for the dataset
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations", datasetId ? `datasetId=${datasetId}` : ""],
    enabled: !!datasetId,
  });

  // Fetch active conversation messages
  const { data: conversationData, isLoading: isLoadingConversation } = useQuery({
    queryKey: ["/api/conversations", activeConversation?.id],
    enabled: !!activeConversation,
  });

  // Mutation for creating a new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (data: { datasetId: number; title: string }) => {
      const response = await apiRequest("POST", "/api/conversations", data);
      return response.json();
    },
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setActiveConversation(newConversation);
    },
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: number; isUser: boolean; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", activeConversation?.id] });
      
      // Update messages state immediately for better UX
      setMessages(prev => [...prev, data.userMessage, data.aiMessage]);
      
      // Set chart data if available
      if (data.chartData && data.chartType) {
        setChartData(data.chartData);
        setChartType(data.chartType);
      }
      
      // Clear the input
      setQuery("");
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  // Update conversations when data changes
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
      
      // If no active conversation is set yet, set the first one
      if (!activeConversation && conversationsData.length > 0) {
        setActiveConversation(conversationsData[0]);
      }
    }
  }, [conversationsData, activeConversation]);

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversationData && conversationData.messages) {
      setMessages(conversationData.messages);
      
      // Scroll to bottom on new messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [conversationData]);

  // Handle new conversation
  const handleNewConversation = () => {
    if (!datasetId) return;
    
    createConversationMutation.mutate({
      datasetId,
      title: `Conversation ${new Date().toLocaleDateString()}`
    });
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || !activeConversation) return;
    
    sendMessageMutation.mutate({
      conversationId: activeConversation.id,
      isUser: true,
      content: query
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Ask Your Data</h2>
        <Button 
          size="sm" 
          onClick={handleNewConversation}
          disabled={!datasetId || createConversationMutation.isPending}
        >
          <i className="ri-add-line mr-1"></i> New Conversation
        </Button>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6">
          {isLoadingConversations ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !datasetId ? (
            <div className="text-center py-10">
              <i className="ri-database-2-line text-4xl text-gray-300"></i>
              <p className="mt-2 text-gray-500">Select a dataset to start a conversation</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10">
              <i className="ri-chat-3-line text-4xl text-gray-300"></i>
              <p className="mt-2 text-gray-500">No conversations yet</p>
              <Button className="mt-4" onClick={handleNewConversation}>
                Start a new conversation
              </Button>
            </div>
          ) : (
            <div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto mb-6">
                {isLoadingConversation ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  messages.map((message, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${message.isUser ? 'bg-gray-300' : 'bg-primary'}`}>
                          <i className={`${message.isUser ? 'ri-user-3-line' : 'ri-robot-line'} text-white`}></i>
                        </div>
                      </div>
                      <div className="ml-3 max-w-3xl">
                        <div className={`conversation-bubble ${message.isUser ? 'user' : 'ai'} relative rounded-lg py-3 px-4 ${message.isUser ? 'bg-primary text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-200'}`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {!message.isUser && chartData && idx === messages.length - 1 && (
                            <div className="bg-gray-50 rounded-lg p-4 my-4">
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  {Object.keys(chartData[0] || {})
                                    .filter(key => key !== 'name')
                                    .map((key, index) => (
                                      <Bar 
                                        key={index} 
                                        dataKey={key} 
                                        fill={index === 0 ? '#3b82f6' : '#10b981'} 
                                      />
                                    ))}
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                          
                          {!message.isUser && idx === messages.length - 1 && (
                            <div className="mt-3 flex space-x-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <i className="ri-download-line mr-1"></i> Export
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <i className="ri-share-line mr-1"></i> Share
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="mt-6 flex">
                <div className="flex-grow relative rounded-md shadow-sm">
                  <Input
                    type="text"
                    placeholder="Ask a question about your data..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={sendMessageMutation.isPending || !activeConversation}
                    className="block w-full pr-10 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="ri-question-line text-gray-400"></i>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="ml-3"
                  disabled={sendMessageMutation.isPending || !query.trim() || !activeConversation}
                >
                  {sendMessageMutation.isPending ? (
                    <i className="ri-loader-4-line animate-spin mr-1"></i>
                  ) : (
                    <i className="ri-send-plane-fill mr-1"></i>
                  )}
                  Ask
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
