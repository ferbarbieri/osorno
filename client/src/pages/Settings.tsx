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
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
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
        <TopBar title="Settings" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="mt-2 text-gray-600">Manage your account and application preferences</p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="api">API Keys</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>
                
                {/* Profile Settings */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={profile.name} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profile.email} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            name="company" 
                            value={profile.company} 
                            onChange={handleProfileChange} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={profile.role} onValueChange={value => setProfile(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                              <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                              <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                              <SelectItem value="Executive">Executive</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                          ) : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* API Keys */}
                <TabsContent value="api">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Keys</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="openai">OpenAI API Key</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleShowApiKey}
                            className="text-xs"
                          >
                            {apiKeys.showKey ? (
                              <>
                                <i className="ri-eye-off-line mr-1"></i>
                                Hide
                              </>
                            ) : (
                              <>
                                <i className="ri-eye-line mr-1"></i>
                                Show
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
                          Required for AI-powered data processing and conversational queries. 
                          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                            Get your API key
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
                          ) : "Save API Keys"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Alerts</Label>
                            <p className="text-sm text-gray-500">Receive important alerts via email</p>
                          </div>
                          <Switch 
                            checked={notifications.emailAlerts}
                            onCheckedChange={value => handleNotificationChange('emailAlerts', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Data Processing Notifications</Label>
                            <p className="text-sm text-gray-500">Get notified when your data has finished processing</p>
                          </div>
                          <Switch 
                            checked={notifications.dataProcessingNotifications}
                            onCheckedChange={value => handleNotificationChange('dataProcessingNotifications', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Marketplace Updates</Label>
                            <p className="text-sm text-gray-500">Receive updates about new datasets in the marketplace</p>
                          </div>
                          <Switch 
                            checked={notifications.marketplaceUpdates}
                            onCheckedChange={value => handleNotificationChange('marketplaceUpdates', value)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-gray-500">Receive weekly summaries of your data insights</p>
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
                            ) : "Save Preferences"}
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
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Share Analytics with Osorno</Label>
                            <p className="text-sm text-gray-500">
                              Allow Osorno to collect anonymous usage data to improve the platform
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
                            <Label>Allow Data Indexing</Label>
                            <p className="text-sm text-gray-500">
                              Allow your public datasets to be indexed for discovery in the marketplace
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
                            ) : "Save Privacy Settings"}
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
