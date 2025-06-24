import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DataUploadWizard from "@/components/DataUploadWizard";
import SalesDashboard from "@/components/SalesDashboard";
import DataChatInterface from "@/components/DataChatInterface";

export default function MyData() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'upload' | 'dashboard'>('upload');
  const [showChat, setShowChat] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDatasetComplete = (datasetType: string) => {
    // For this prototype, we'll show the sales dashboard regardless of detected type
    setCurrentView('dashboard');
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
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
        <TopBar 
          title={currentView === 'upload' ? "Conecte Seus Dados" : "Analytics de Vendas"} 
          onToggleSidebar={toggleSidebar} 
        />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {currentView === 'upload' ? (
                <div className="flex justify-center">
                  <DataUploadWizard onComplete={handleDatasetComplete} />
                </div>
              ) : (
                <SalesDashboard onStartChat={handleStartChat} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Chat Interface Modal */}
      {showChat && <DataChatInterface onClose={handleCloseChat} />}
    </div>
  );
}
