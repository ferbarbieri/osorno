import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
  { name: "Meus Dados", path: "/mydata", icon: "ri-database-2-line" },
  { name: "Perguntar aos Dados", path: "/askdata", icon: "ri-chat-3-line" },
  { name: "Analytics", path: "/analytics", icon: "ri-line-chart-line" },
  { name: "Marketplace", path: "/marketplace", icon: "ri-store-2-line" },
  { name: "Configurações", path: "/settings", icon: "ri-settings-3-line" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="flex items-center">
              <img 
                src="/osorno-logo.png" 
                alt="Osorno Analytics" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          <nav className="mt-2 flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "group flex items-center px-2 py-3 text-sm font-medium rounded-md cursor-pointer",
                    location === item.path
                      ? "bg-primary-50 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <i className={`${item.icon} text-xl mr-3`}></i>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <a href="#" className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="ri-user-line text-gray-500"></i>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  John Smith
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
