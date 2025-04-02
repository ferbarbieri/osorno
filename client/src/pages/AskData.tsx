import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { parseQueryString } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DataConversation from "@/components/DataConversation";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { type Dataset } from "@shared/schema";

export default function AskData() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { datasetId: datasetIdFromUrl } = parseQueryString(location.split("?")[1] || "");
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | undefined>(
    datasetIdFromUrl ? parseInt(datasetIdFromUrl) : undefined
  );
  
  // Fetch datasets for the dropdown
  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });
  
  // Update URL when dataset changes
  useEffect(() => {
    if (selectedDatasetId) {
      setLocation(`/askdata?datasetId=${selectedDatasetId}`, { replace: true });
    }
  }, [selectedDatasetId, setLocation]);
  
  // Update selected dataset from URL if it changes
  useEffect(() => {
    if (datasetIdFromUrl && parseInt(datasetIdFromUrl) !== selectedDatasetId) {
      setSelectedDatasetId(parseInt(datasetIdFromUrl));
    }
  }, [datasetIdFromUrl, selectedDatasetId]);
  
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
        <TopBar title="Ask Data" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Ask Data</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Dataset selector */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-700">Select Dataset:</div>
                    <div className="flex-1 max-w-xs">
                      <Select
                        value={selectedDatasetId?.toString()}
                        onValueChange={(value) => setSelectedDatasetId(parseInt(value))}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          {datasets?.map((dataset) => (
                            <SelectItem key={dataset.id} value={dataset.id.toString()}>
                              {dataset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Conversation component */}
              <DataConversation datasetId={selectedDatasetId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
