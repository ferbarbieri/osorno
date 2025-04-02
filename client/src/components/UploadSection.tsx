import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function UploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const supportedFileTypes = [
    { icon: "ri-database-2-line", name: "MySQL" },
    { icon: "ri-database-2-line", name: "PostgreSQL" },
    { icon: "ri-file-excel-2-line", name: "Excel" },
    { icon: "ri-file-list-3-line", name: "CSV" },
    { icon: "ri-file-code-line", name: "JSON" },
  ];

  const uploadMutation = useMutation({
    mutationFn: async (data: { 
      name: string;
      fileType: string;
      fileContent: string;
    }) => {
      const response = await apiRequest("POST", "/api/datasets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      setFile(null);
      setFileName("");
      setFileType("");
      setFileContent(null);
      setUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Dataset uploaded successfully",
        description: "Your data is being processed and will be available soon.",
      });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your dataset. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
    }
  });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Determine file type from extension
    const name = selectedFile.name;
    setFileName(name);
    
    const extension = name.split('.').pop()?.toLowerCase() || '';
    let type = '';
    
    if (extension === 'csv') type = 'csv';
    else if (extension === 'json') type = 'json';
    else if (['xls', 'xlsx'].includes(extension)) type = 'excel';
    else type = extension;
    
    setFileType(type);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target?.result as string);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
      
      const extension = droppedFile.name.split('.').pop()?.toLowerCase() || '';
      let type = '';
      
      if (extension === 'csv') type = 'csv';
      else if (extension === 'json') type = 'json';
      else if (['xls', 'xlsx'].includes(extension)) type = 'excel';
      else type = extension;
      
      setFileType(type);

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file || !fileContent || !fileName || !fileType) {
      toast({
        title: "Upload error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return next;
      });
    }, 300);
    
    // Process the upload
    uploadMutation.mutate({
      name: fileName,
      fileType,
      fileContent,
    });
    
    // Clear the progress interval
    return () => clearInterval(progressInterval);
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upload New Data</h2>
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <i className={fileType === 'csv' ? 'ri-file-list-3-line text-gray-500' : 
                               fileType === 'json' ? 'ri-file-code-line text-gray-500' : 
                               'ri-file-excel-2-line text-gray-500'} />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                
                {uploading ? (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-gray-500 text-center">{uploadProgress}% - Processing your data...</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleUpload} className="flex-1">
                      <i className="ri-upload-line mr-2"></i>
                      Upload Now
                    </Button>
                    <Button variant="outline" onClick={() => setFile(null)}>
                      <i className="ri-close-line mr-2"></i>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg px-6 py-10 cursor-pointer hover:border-primary transition-colors"
                onClick={handleFileClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-1 text-center">
                  <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mx-auto"></i>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none">
                      <span>Upload a file</span>
                      <Input 
                        id="file-upload" 
                        ref={fileInputRef}
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".csv,.json,.xls,.xlsx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV, JSON, Excel up to 100MB</p>
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <div className="text-sm font-medium text-gray-500">
              Supported data sources
            </div>
            <div className="mt-2 flex space-x-4">
              {supportedFileTypes.map((type, index) => (
                <div key={index} className="flex items-center">
                  <i className={`${type.icon} text-gray-400 mr-1`}></i>
                  <span className="text-xs text-gray-500">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
