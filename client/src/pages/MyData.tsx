import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { parseQueryString } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import UploadSection from "@/components/UploadSection";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { type Dataset } from "@shared/schema";

export default function MyData() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { datasetId } = parseQueryString(location.split("?")[1] || "");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Fetch datasets
  const { data: datasets, isLoading: isLoadingDatasets } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });
  
  // Fetch selected dataset content
  const { data: selectedDataset, isLoading: isLoadingSelectedDataset } = useQuery<Dataset>({
    queryKey: ["/api/datasets", datasetId],
    enabled: !!datasetId,
  });
  
  // Fetch dataset content
  const { data: dataContent, isLoading: isLoadingDataContent } = useQuery({
    queryKey: ["/api/datasets", datasetId, "content"],
    enabled: !!datasetId,
  });

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
        <TopBar title="My Data" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">My Data</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Content sections */}
              <UploadSection />
              
              <div className="mt-8">
                <Tabs defaultValue="datasets">
                  <TabsList>
                    <TabsTrigger value="datasets">Datasets</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="datasets" className="mt-4">
                    <Card>
                      <CardContent className="p-0">
                        {isLoadingDatasets ? (
                          <div className="p-6 space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        ) : datasets && datasets.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rows
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {datasets.map((dataset) => (
                                  <tr key={dataset.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="bg-gray-100 rounded-md p-2 mr-3">
                                          <i className={dataset.fileType === 'csv' ? 'ri-file-list-3-line text-gray-500' : 
                                                      dataset.fileType === 'json' ? 'ri-file-code-line text-gray-500' : 
                                                      'ri-file-excel-2-line text-gray-500'}></i>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-500">{dataset.fileType.toUpperCase()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-500">{dataset.rowCount?.toLocaleString() || '0'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${dataset.status === 'processed' ? 'bg-green-100 text-green-800' : 
                                          dataset.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                          dataset.status === 'error' ? 'bg-red-100 text-red-800' : 
                                          'bg-gray-100 text-gray-800'}`}>
                                        {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(dataset.updatedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <a href={`/mydata?datasetId=${dataset.id}`} className="text-primary hover:text-primary/90 mr-4">View</a>
                                      <a href={`/askdata?datasetId=${dataset.id}`} className="text-primary hover:text-primary/90">Query</a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-gray-500">No datasets found. Upload data to get started.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="connections" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-10">
                          <i className="ri-database-2-line text-4xl text-gray-300"></i>
                          <p className="mt-2 text-gray-500">No database connections configured</p>
                          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90">
                            <i className="ri-add-line mr-1"></i> Add Connection
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="integrations" className="mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-10">
                          <i className="ri-plug-line text-4xl text-gray-300"></i>
                          <p className="mt-2 text-gray-500">No integrations configured</p>
                          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90">
                            <i className="ri-add-line mr-1"></i> Add Integration
                          </button>
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
