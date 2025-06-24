import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DataUploadWizardProps {
  onComplete: (datasetType: string) => void;
}

export default function DataUploadWizard({ onComplete }: DataUploadWizardProps) {
  const [currentStep, setCurrentStep] = useState<'input' | 'processing' | 'preview'>('input');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'database'>('file');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedDataset, setDetectedDataset] = useState<any>(null);

  // Database connection form
  const [dbConfig, setDbConfig] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    table: ''
  });

  // File upload simulation
  const simulateFileUpload = async () => {
    setCurrentStep('processing');
    setProcessing(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock detected dataset
    const mockDataset = {
      name: 'Sales Performance Q1-Q4 2024',
      type: 'sales',
      rows: 15847,
      columns: 12,
      detectedColumns: [
        { name: 'order_id', type: 'identifier', confidence: 98 },
        { name: 'customer_name', type: 'text', confidence: 95 },
        { name: 'product_category', type: 'category', confidence: 92 },
        { name: 'sales_amount', type: 'currency', confidence: 99 },
        { name: 'order_date', type: 'date', confidence: 97 },
        { name: 'region', type: 'category', confidence: 94 },
        { name: 'sales_rep', type: 'text', confidence: 89 },
        { name: 'quantity', type: 'numeric', confidence: 96 }
      ],
      suggestedKPIs: [
        'Total Revenue',
        'Monthly Sales Trend',
        'Top Performing Products',
        'Regional Performance',
        'Sales Rep Leaderboard',
        'Average Order Value'
      ]
    };
    
    setDetectedDataset(mockDataset);
    setProcessing(false);
    setCurrentStep('preview');
  };

  // Database connection simulation
  const simulateDbConnection = async () => {
    setCurrentStep('processing');
    setProcessing(true);
    
    // Simulate connection steps
    const steps = [
      'Establishing connection...',
      'Validating credentials...',
      'Scanning database schema...',
      'Analyzing data structure...',
      'Detecting patterns...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Mock detected dataset
    const mockDataset = {
      name: 'Enterprise Sales Database',
      type: 'sales',
      rows: 234567,
      columns: 18,
      detectedColumns: [
        { name: 'transaction_id', type: 'identifier', confidence: 99 },
        { name: 'customer_segment', type: 'category', confidence: 94 },
        { name: 'revenue', type: 'currency', confidence: 98 },
        { name: 'profit_margin', type: 'percentage', confidence: 91 },
        { name: 'acquisition_cost', type: 'currency', confidence: 87 },
        { name: 'lifetime_value', type: 'currency', confidence: 93 }
      ],
      suggestedKPIs: [
        'Revenue Growth Rate',
        'Customer Acquisition Cost',
        'Lifetime Value',
        'Profit Margins by Segment',
        'Churn Rate',
        'Monthly Recurring Revenue'
      ]
    };
    
    setDetectedDataset(mockDataset);
    setProcessing(false);
    setCurrentStep('preview');
  };

  const handleConfirmDataset = () => {
    onComplete(detectedDataset.type);
  };

  if (currentStep === 'processing') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="ri-robot-line text-primary mr-2"></i>
            AI Processing Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-primary/30 border-b-transparent rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="text-lg font-medium">Analyzing your data with AI...</p>
            <p className="text-gray-600 mt-2">
              {uploadMethod === 'file' ? 'Processing uploaded file' : 'Connecting to database'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Processing Steps:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center">
                <i className={`ri-check-line text-green-500 mr-2 ${progress > 20 ? '' : 'opacity-30'}`}></i>
                Data ingestion
              </li>
              <li className="flex items-center">
                <i className={`ri-check-line text-green-500 mr-2 ${progress > 40 ? '' : 'opacity-30'}`}></i>
                Schema detection
              </li>
              <li className="flex items-center">
                <i className={`ri-check-line text-green-500 mr-2 ${progress > 60 ? '' : 'opacity-30'}`}></i>
                Data profiling
              </li>
              <li className="flex items-center">
                <i className={`ri-check-line text-green-500 mr-2 ${progress > 80 ? '' : 'opacity-30'}`}></i>
                Pattern recognition
              </li>
              <li className="flex items-center">
                <i className={`ri-check-line text-green-500 mr-2 ${progress > 95 ? '' : 'opacity-30'}`}></i>
                KPI recommendations
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'preview' && detectedDataset) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="ri-database-2-line text-green-500 mr-2"></i>
            Dataset Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <i className="ri-check-circle-line text-green-500 mr-2"></i>
              <span className="font-medium text-green-800">Successfully analyzed your data!</span>
            </div>
            <p className="text-green-700">
              Our AI has identified this as a <strong>{detectedDataset.type}</strong> dataset with {detectedDataset.rows.toLocaleString()} rows and {detectedDataset.columns} columns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Detected Columns</h3>
              <div className="space-y-2">
                {detectedDataset.detectedColumns.map((col: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{col.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{col.type}</Badge>
                      <span className="text-sm text-gray-500">{col.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Suggested KPIs</h3>
              <div className="space-y-2">
                {detectedDataset.suggestedKPIs.map((kpi: string, idx: number) => (
                  <div key={idx} className="flex items-center p-2 bg-blue-50 rounded">
                    <i className="ri-pie-chart-line text-blue-500 mr-2"></i>
                    <span>{kpi}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('input')}>
              Start Over
            </Button>
            <Button onClick={handleConfirmDataset} className="bg-green-600 hover:bg-green-700">
              <i className="ri-check-line mr-2"></i>
              Create Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Connect Your Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={uploadMethod} onValueChange={(value: any) => setUploadMethod(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="database">Connect Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <i className="ri-file-upload-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Upload your data file</h3>
              <p className="text-gray-600 mb-4">Support for Excel, CSV, and JSON files</p>
              <Button onClick={simulateFileUpload}>
                <i className="ri-upload-line mr-2"></i>
                Choose File
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              For demo purposes, this will simulate uploading a sales dataset
            </p>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input 
                  id="host" 
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input 
                  id="port" 
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                  placeholder="5432"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input 
                id="database" 
                value={dbConfig.database}
                onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                placeholder="sales_db"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={dbConfig.username}
                  onChange={(e) => setDbConfig({...dbConfig, username: e.target.value})}
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={dbConfig.password}
                  onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="table">Table/View (Optional)</Label>
              <Input 
                id="table" 
                value={dbConfig.table}
                onChange={(e) => setDbConfig({...dbConfig, table: e.target.value})}
                placeholder="sales_transactions"
              />
            </div>
            
            <Button onClick={simulateDbConnection} className="w-full">
              <i className="ri-database-2-line mr-2"></i>
              Connect & Analyze
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              For demo purposes, this will simulate connecting to a sales database
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}