import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    company: "Acme Inc.",
    role: "Data Analyst"
  });
  
  // API keys
  const [apiKeys, setApiKeys] = useState({
    openai: process.env.OPENAI_API_KEY || "",
    showKey: false
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dataProcessingNotifications: true,
    marketplaceUpdates: false,
    weeklyReports: true
  });
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    shareAnalyticsWithOsorno: true,
    allowDataIndexing: false
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleShowApiKey = () => {
    setApiKeys(prev => ({ ...prev, showKey: !prev.showKey }));
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <i className="ri-close-line text-white text-2xl"></i>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopBar title="Configurações" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
              <p className="mt-2 text-gray-600">Gerencie sua conta e preferências da aplicação</p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="api">Chaves API</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                  <TabsTrigger value="privacy">Privacidade</TabsTrigger>
                </TabsList>
                
                {/* Profile Settings */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={profile.name} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Endereço de Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profile.email} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa</Label>
                          <Input 
                            id="company" 
                            name="company" 
                            value={profile.company} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role">Cargo</Label>
                          <Select value={profile.role} onValueChange={value => setProfile(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Data Analyst">Analista de Dados</SelectItem>
                              <SelectItem value="Data Scientist">Cientista de Dados</SelectItem>
                              <SelectItem value="Business Analyst">Analista de Negócios</SelectItem>
                              <SelectItem value="Executive">Executivo</SelectItem>
                              <SelectItem value="Other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button onClick={handleSaveSettings} disabled={loading}>
                          {loading ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                              Saving...
                            </>
                          ) : "Salvar Alterações"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* API Keys */}
                <TabsContent value="api">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chaves API</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="openai">Chave API OpenAI</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleShowApiKey}
                            className="text-xs"
                          >
                            {apiKeys.showKey ? (
                              <>
                                <i className="ri-eye-off-line mr-1"></i>
                                Ocultar
                              </>
                            ) : (
                              <>
                                <i className="ri-eye-line mr-1"></i>
                                Mostrar
                              </>
                            )}
                          </Button>
                        </div>
                        <Input 
                          id="openai" 
                          name="openai" 
                          type={apiKeys.showKey ? "text" : "password"} 
                          value={apiKeys.openai} 
                          onChange={handleApiKeyChange} 
                          placeholder="sk-..." 
                        />
                        <p className="text-xs text-gray-500">
                          Necessário para processamento de dados com IA e consultas conversacionais. 
                          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                            Obter sua chave API
                          </a>
                        </p>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="pt-2">
                        <Button onClick={handleSaveSettings} disabled={loading}>
                          {loading ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                              Saving...
                            </>
                          ) : "Salvar Chaves API"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências de Notificação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas por Email</Label>
                            <p className="text-sm text-gray-500">Receba alertas importantes por email</p>
                          </div>
                          <Switch 
                            checked={notifications.emailAlerts}
                            onCheckedChange={value => handleNotificationChange('emailAlerts', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações de Processamento</Label>
                            <p className="text-sm text-gray-500">Seja notificado quando seus dados terminarem de processar</p>
                          </div>
                          <Switch 
                            checked={notifications.dataProcessingNotifications}
                            onCheckedChange={value => handleNotificationChange('dataProcessingNotifications', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Atualizações do Marketplace</Label>
                            <p className="text-sm text-gray-500">Receba atualizações sobre novos datasets no marketplace</p>
                          </div>
                          <Switch 
                            checked={notifications.marketplaceUpdates}
                            onCheckedChange={value => handleNotificationChange('marketplaceUpdates', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Relatórios Semanais</Label>
                            <p className="text-sm text-gray-500">Receba resumos semanais dos seus insights de dados</p>
                          </div>
                          <Switch 
                            checked={notifications.weeklyReports}
                            onCheckedChange={value => handleNotificationChange('weeklyReports', value)}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button onClick={handleSaveSettings} disabled={loading}>
                            {loading ? (
                              <>
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                Saving...
                              </>
                            ) : "Salvar Preferências"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Privacy Settings */}
                <TabsContent value="privacy">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Privacidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Compartilhar Analytics com Osorno</Label>
                            <p className="text-sm text-gray-500">
                              Permitir que a Osorno colete dados de uso anônimos para melhorar a plataforma
                            </p>
                          </div>
                          <Switch 
                            checked={privacy.shareAnalyticsWithOsorno}
                            onCheckedChange={value => handlePrivacyChange('shareAnalyticsWithOsorno', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Permitir Indexação de Dados</Label>
                            <p className="text-sm text-gray-500">
                              Permitir que seus datasets públicos sejam indexados para descoberta no marketplace
                            </p>
                          </div>
                          <Switch 
                            checked={privacy.allowDataIndexing}
                            onCheckedChange={value => handlePrivacyChange('allowDataIndexing', value)}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button onClick={handleSaveSettings} disabled={loading}>
                            {loading ? (
                              <>
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                Saving...
                              </>
                            ) : "Salvar Configurações de Privacidade"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
