import { useState } from "react";
import { useLocation, Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DatasetDetails() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock dataset details based on URL or default
  const datasetDetails = {
    id: 1,
    title: "Dados de Comportamento do Consumidor no Varejo",
    description: "Um conjunto de dados abrangente sobre padrões de compra de consumidores, preferências e dados demográficos coletados de múltiplas lojas de varejo ao longo de 2 anos.",
    category: "Varejo & E-commerce",
    price: "R$ 2.500",
    rating: 4.5,
    downloads: 1247,
    lastUpdated: "2024-12-15",
    size: "450 MB",
    format: "CSV, JSON",
    tags: ["comportamento-consumidor", "varejo", "analytics", "segmentação"],
    author: "Instituto de Pesquisa de Varejo",
    license: "Comercial",
    features: [
      "Mais de 500.000 registros de transações",
      "Dados demográficos de clientes",
      "Histórico de compras por categoria",
      "Dados de sazonalidade",
      "Informações geográficas",
      "Análise de sentimento de reviews"
    ],
    sampleData: [
      { customer_id: "C001", age: 34, gender: "F", purchase_amount: 156.78, category: "Roupas" },
      { customer_id: "C002", age: 28, gender: "M", purchase_amount: 89.99, category: "Eletrônicos" },
      { customer_id: "C003", age: 42, gender: "F", purchase_amount: 234.50, category: "Casa & Jardim" },
      { customer_id: "C004", age: 31, gender: "M", purchase_amount: 67.25, category: "Esportes" },
      { customer_id: "C005", age: 29, gender: "F", purchase_amount: 123.40, category: "Beleza" }
    ]
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
        <TopBar title="Detalhes do Dataset" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Link href="/marketplace" className="text-primary hover:text-primary/80">
                  ← Voltar ao Marketplace
                </Link>
              </div>

              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {datasetDetails.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {datasetDetails.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {datasetDetails.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="flex">
                          {Array(5).fill(0).map((_, idx) => (
                            <i 
                              key={idx} 
                              className={`${idx < Math.floor(datasetDetails.rating) ? 'ri-star-fill' : 'ri-star-line'} text-yellow-400`}
                            ></i>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {datasetDetails.rating} ({datasetDetails.downloads} downloads)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8">
                    <Card className="w-80">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-primary mb-2">
                            {datasetDetails.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            Licença {datasetDetails.license}
                          </div>
                        </div>
                        <Button className="w-full mb-3">
                          <i className="ri-shopping-cart-line mr-2"></i>
                          Comprar Dataset
                        </Button>
                        <Button variant="outline" className="w-full">
                          <i className="ri-eye-line mr-2"></i>
                          Visualizar Amostra
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recursos do Dataset</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {datasetDetails.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <i className="ri-check-line text-green-500 mr-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Sample Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Amostra dos Dados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID Cliente
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Idade
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gênero
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor Compra
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoria
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {datasetDetails.sampleData.map((row, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {row.customer_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {row.age}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {row.gender}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  R$ {row.purchase_amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {row.category}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Dataset</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Categoria</div>
                        <div className="text-sm text-gray-900">{datasetDetails.category}</div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Tamanho</div>
                        <div className="text-sm text-gray-900">{datasetDetails.size}</div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Formato</div>
                        <div className="text-sm text-gray-900">{datasetDetails.format}</div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Última Atualização</div>
                        <div className="text-sm text-gray-900">{datasetDetails.lastUpdated}</div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Autor</div>
                        <div className="text-sm text-gray-900">{datasetDetails.author}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Suporte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <i className="ri-question-line mr-2"></i>
                        Central de Ajuda
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <i className="ri-message-3-line mr-2"></i>
                        Contatar Vendedor
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <i className="ri-flag-line mr-2"></i>
                        Reportar Problema
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}