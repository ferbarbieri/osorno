import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Cell,
  AreaChart,
  Area
} from "recharts";

interface SalesDashboardProps {
  onStartChat: () => void;
}

export default function SalesDashboard({ onStartChat }: SalesDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('quarterly');

  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 245000, target: 220000 },
    { month: 'Feb', revenue: 198000, target: 225000 },
    { month: 'Mar', revenue: 312000, target: 230000 },
    { month: 'Apr', revenue: 289000, target: 235000 },
    { month: 'May', revenue: 401000, target: 240000 },
    { month: 'Jun', revenue: 378000, target: 245000 },
    { month: 'Jul', revenue: 423000, target: 250000 },
    { month: 'Aug', revenue: 395000, target: 255000 },
    { month: 'Sep', revenue: 445000, target: 260000 },
    { month: 'Oct', revenue: 421000, target: 265000 },
    { month: 'Nov', revenue: 467000, target: 270000 },
    { month: 'Dec', revenue: 492000, target: 275000 }
  ];

  const regionPerformance = [
    { region: 'North America', sales: 1250000, growth: 15.2 },
    { region: 'Europe', sales: 980000, growth: 8.7 },
    { region: 'Asia Pacific', sales: 756000, growth: 22.1 },
    { region: 'Latin America', sales: 340000, growth: -3.4 },
    { region: 'Middle East', sales: 189000, growth: 12.8 }
  ];

  const productCategories = [
    { name: 'Software Licenses', value: 45, revenue: 2100000 },
    { name: 'Professional Services', value: 25, revenue: 1175000 },
    { name: 'Support & Maintenance', value: 20, revenue: 940000 },
    { name: 'Training', value: 10, revenue: 470000 }
  ];

  const salesRepPerformance = [
    { name: 'Sarah Johnson', deals: 45, revenue: 850000, quota: 120 },
    { name: 'Mike Chen', deals: 38, revenue: 720000, quota: 95 },
    { name: 'Emily Rodriguez', deals: 42, revenue: 680000, quota: 105 },
    { name: 'David Kim', deals: 35, revenue: 590000, quota: 88 },
    { name: 'Lisa Thompson', deals: 28, revenue: 520000, quota: 78 }
  ];

  const conversionFunnel = [
    { stage: 'Leads', count: 12450, percentage: 100 },
    { stage: 'Qualified', count: 4980, percentage: 40 },
    { stage: 'Proposals', count: 1245, percentage: 25 },
    { stage: 'Negotiations', count: 498, percentage: 40 },
    { stage: 'Closed Won', count: 249, percentage: 50 }
  ];

  const COLORS = ['#FF7A00', '#6B7280', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Vendas</h1>
          <p className="text-gray-600 mt-1">Insights em tempo real sobre sua performance de vendas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <i className="ri-download-line mr-2"></i>
            Exportar Relatório
          </Button>
          <Button onClick={onStartChat}>
            <i className="ri-chat-3-line mr-2"></i>
            Fazer Perguntas
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-3xl font-bold text-gray-900">R$ 4,21M</p>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="ri-arrow-up-line mr-1"></i>
                    +12,5%
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">vs último trimestre</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negócios Fechados</p>
                <p className="text-3xl font-bold text-gray-900">249</p>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="ri-arrow-up-line mr-1"></i>
                    +8,2%
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">vs último trimestre</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-2xl text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900">20,0%</p>
                <div className="flex items-center mt-2">
                  <Badge className="bg-red-100 text-red-800">
                    <i className="ri-arrow-down-line mr-1"></i>
                    -2,1%
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">vs último trimestre</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-pie-chart-line text-2xl text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-3xl font-bold text-gray-900">R$ 16,9K</p>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="ri-arrow-up-line mr-1"></i>
                    +5,7%
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">vs último trimestre</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-box-line text-2xl text-orange-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Tendências de Receita</TabsTrigger>
          <TabsTrigger value="regions">Performance Regional</TabsTrigger>
          <TabsTrigger value="products">Mix de Produtos</TabsTrigger>
          <TabsTrigger value="team">Performance da Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal vs Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#FF7A00" name="Actual Revenue" />
                  <Bar dataKey="target" fill="#6B7280" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Vendas Regional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionPerformance.map((region, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{region.region}</h4>
                      <p className="text-sm text-gray-600">${region.sales.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={region.growth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {region.growth >= 0 ? '+' : ''}{region.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Categoria de Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {productCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes das Categorias de Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productCategories.map((category, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{category.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking dos Representantes de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesRepPerformance.map((rep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-4">
                        {rep.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{rep.name}</h4>
                        <p className="text-sm text-gray-600">{rep.deals} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${rep.revenue.toLocaleString()}</p>
                      <Badge className={rep.quota >= 100 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                        {rep.quota}% of quota
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}