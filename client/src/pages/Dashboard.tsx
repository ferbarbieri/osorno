import { useState } from "react";
import { Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                <span className="sr-only">Fechar barra lateral</span>
                <i className="ri-close-line text-white text-2xl"></i>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopBar title="Dashboard" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo à Osorno</h1>
                <p className="text-xl text-gray-600 mb-8">Transforme seus dados em insights acionáveis com análises alimentadas por IA</p>
                
                <div className="flex justify-center space-x-4">
                  <Link href="/mydata">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <i className="ri-database-2-line mr-2"></i>
                      Conectar Dados
                    </Button>
                  </Link>
                  <Link href="/askdata">
                    <Button size="lg" variant="outline">
                      <i className="ri-chat-3-line mr-2"></i>
                      Fazer Perguntas
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-6 border-orange-100 hover:border-orange-200 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-upload-cloud-line text-3xl text-orange-600"></i>
                    </div>
                    <CardTitle className="text-gray-700">Conecte Seus Dados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Faça upload de arquivos ou conecte-se a bancos de dados. Nossa IA detecta automaticamente padrões e sugere a melhor abordagem de análise.</p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-orange-100 hover:border-orange-200 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-robot-line text-3xl text-gray-600"></i>
                    </div>
                    <CardTitle className="text-gray-700">Análise com IA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Deixe nossa IA analisar seus dados e gerar dashboards interativos com indicadores-chave de performance personalizados para seu negócio.</p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-orange-100 hover:border-orange-200 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-chat-3-line text-3xl text-orange-600"></i>
                    </div>
                    <CardTitle className="text-gray-700">Faça Perguntas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Tenha uma conversa com seus dados. Faça perguntas em português simples e obtenha insights instantâneos com gráficos e explicações.</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
                      <p className="text-lg mb-6 opacity-90">Experimente o poder da análise orientada por IA com seus próprios dados. Faça upload de um arquivo ou conecte-se ao seu banco de dados e veja insights em minutos.</p>
                      <Link href="/mydata">
                        <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50">
                          <i className="ri-arrow-right-line mr-2"></i>
                          Iniciar Demo
                        </Button>
                      </Link>
                    </div>
                    <div className="text-center">
                      <i className="ri-line-chart-line text-8xl opacity-20"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
