import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DataChatInterface from "@/components/DataChatInterface";

export default function AskData() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        <TopBar title="Ask Data" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="h-full flex items-center justify-center p-6">
            {showChat ? (
              <div className="relative w-full max-w-4xl">
                <DataChatInterface onClose={handleCloseChat} />
              </div>
            ) : (
              <div className="text-center">
                <i className="ri-chat-3-line text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Ready to explore your data?
                </h2>
                <p className="text-gray-500 mb-6">
                  Start a conversation with your AI data assistant
                </p>
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Asking Questions
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
