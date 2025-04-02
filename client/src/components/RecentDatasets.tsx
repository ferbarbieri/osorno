import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { type Dataset } from "@shared/schema";

export default function RecentDatasets() {
  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Recent Datasets</h2>
        <Link href="/mydata">
          <a className="text-sm font-medium text-primary hover:text-primary/90">View all</a>
        </Link>
      </div>
      <Card className="mt-4">
        <CardContent className="p-0">
          {isLoading ? (
            <DatasetSkeleton />
          ) : datasets && datasets.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {datasets.slice(0, 3).map((dataset) => (
                <DatasetItem key={dataset.id} dataset={dataset} />
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No datasets found. Upload data to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DatasetItem({ dataset }: { dataset: Dataset }) {
  // Format the updated date
  const formatDate = (date: Date) => {
    const now = new Date();
    const updated = new Date(date);
    
    const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `Updated ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `Updated ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `Updated ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Updated just now';
    }
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-md p-2 mr-3">
              <i className={dataset.fileType === 'csv' ? 'ri-file-list-3-line text-gray-500' : 
                            dataset.fileType === 'json' ? 'ri-file-code-line text-gray-500' : 
                            'ri-file-excel-2-line text-gray-500'}></i>
            </div>
            <p className="text-sm font-medium text-primary truncate">
              {dataset.name}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex">
            <Badge
              variant={dataset.status === 'processed' ? 'default' : 
                       dataset.status === 'processing' ? 'secondary' : 
                       dataset.status === 'error' ? 'destructive' : 'outline'}
            >
              {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              <i className="ri-file-list-3-line flex-shrink-0 mr-1.5 text-gray-400"></i>
              <span>{dataset.rowCount?.toLocaleString() || '0'} rows</span>
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <i className="ri-time-line flex-shrink-0 mr-1.5 text-gray-400"></i>
              <span>{formatDate(dataset.updatedAt)}</span>
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <Link href={`/askdata?datasetId=${dataset.id}`}>
              <Button variant="ghost" className="text-primary hover:text-primary/90">
                <i className="ri-chat-3-line mr-1"></i> Query
              </Button>
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link href={`/mydata?datasetId=${dataset.id}`}>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-500">
                <i className="ri-eye-line mr-1"></i> View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

function DatasetSkeleton() {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {[1, 2].map((i) => (
        <li key={i} className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-md mr-3" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <Skeleton className="h-4 w-24 mr-6" />
              <Skeleton className="h-4 w-32 mt-2 sm:mt-0" />
            </div>
            <div className="mt-2 sm:mt-0">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
