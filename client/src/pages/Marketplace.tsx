import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { type MarketplaceItem } from "@shared/schema";

export default function Marketplace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Fetch marketplace items
  const { data: marketplaceItems, isLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ["/api/marketplace"],
  });
  
  // Filter items based on search query
  const filteredItems = marketplaceItems?.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TopBar title="Marketplace" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Marketplace de Dados</h1>
              <p className="mt-2 text-gray-600">Descubra datasets valiosos ou monetize seus próprios dados</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Search and filter */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="ri-search-line text-gray-400"></i>
                        </div>
                        <Input
                          type="text"
                          placeholder="Buscar por datasets..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button className="w-full md:w-auto">
                        <i className="ri-store-2-line mr-1"></i> Listar Meus Dados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Marketplace content */}
              <div className="mt-6">
                <Tabs defaultValue="browse">
                  <TabsList>
                    <TabsTrigger value="browse">Navegar</TabsTrigger>
                    <TabsTrigger value="purchased">Comprados</TabsTrigger>
                    <TabsTrigger value="selling">Meus Anúncios</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="browse" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {isLoading ? (
                        <>
                          <MarketplaceItemSkeleton />
                          <MarketplaceItemSkeleton />
                          <MarketplaceItemSkeleton />
                          <MarketplaceItemSkeleton />
                          <MarketplaceItemSkeleton />
                          <MarketplaceItemSkeleton />
                        </>
                      ) : filteredItems && filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <MarketplaceItem key={item.id} item={item} />
                        ))
                      ) : (
                        <div className="col-span-3 py-10 text-center">
                          <p className="text-gray-500">
                            {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item disponível no marketplace'}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="purchased" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-10">
                          <i className="ri-shopping-cart-line text-4xl text-gray-300"></i>
                          <p className="mt-2 text-gray-500">Você ainda não comprou nenhum dataset</p>
                          <Button className="mt-4">
                            Navegar Marketplace
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="selling" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-10">
                          <i className="ri-price-tag-3-line text-4xl text-gray-300"></i>
                          <p className="mt-2 text-gray-500">Você ainda não está vendendo nenhum dataset</p>
                          <Button className="mt-4">
                            <i className="ri-add-line mr-1"></i> Listar Meus Dados
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MarketplaceItem({ item }: { item: MarketplaceItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 w-full flex items-center justify-center">
        <i className={getIconByTitle(item.title)}></i>
      </div>
      <CardContent className="p-4">
        <h3 className="text-md font-medium text-gray-900 truncate">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3">
          {item.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-md font-semibold text-primary">
            {item.price}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">Avaliação:</span>
            <div className="flex">
              {Array(5).fill(0).map((_, idx) => (
                <i 
                  key={idx} 
                  className={`${idx < item.rating ? 'ri-star-fill' : 'ri-star-line'} text-yellow-400`}
                ></i>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <Button className="w-full">
            View Details
          </Button>
          <Button variant="outline" className="w-full">
            <i className="ri-shopping-cart-line mr-1"></i> Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketplaceItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex justify-between mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Helper function to get icon based on marketplace item title
function getIconByTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('retail') || lowerTitle.includes('consumer')) {
    return 'ri-bar-chart-box-line text-5xl text-gray-400';
  } else if (lowerTitle.includes('supply') || lowerTitle.includes('chain')) {
    return 'ri-line-chart-line text-5xl text-gray-400';
  } else if (lowerTitle.includes('financial') || lowerTitle.includes('market')) {
    return 'ri-pie-chart-2-line text-5xl text-gray-400';
  } else {
    return 'ri-bar-chart-grouped-line text-5xl text-gray-400';
  }
}
