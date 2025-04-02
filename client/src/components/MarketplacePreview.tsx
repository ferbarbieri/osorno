import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type MarketplaceItem } from "@shared/schema";

export default function MarketplacePreview() {
  const { data: marketplaceItems, isLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ["/api/marketplace"],
  });

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Data Marketplace</h2>
        <Link href="/marketplace">
          <a className="text-sm font-medium text-primary hover:text-primary/90">
            Explore Marketplace
          </a>
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <MarketplaceItemSkeleton />
              <MarketplaceItemSkeleton />
              <MarketplaceItemSkeleton />
            </>
          ) : marketplaceItems && marketplaceItems.length > 0 ? (
            marketplaceItems.map((item) => (
              <MarketplaceItem key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-3 py-10 text-center">
              <p className="text-gray-500">No marketplace items available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketplaceItem({ item }: { item: MarketplaceItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gray-200 w-full flex items-center justify-center">
        <i className={getIconByTitle(item.title)}></i>
      </div>
      <CardContent className="p-4">
        <h3 className="text-md font-medium text-gray-900 truncate">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-md font-semibold text-primary">
            {item.price}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">Rating:</span>
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
        <Button className="mt-3 w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

function MarketplaceItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex justify-between mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

// Helper function to get icon based on marketplace item title
function getIconByTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('retail') || lowerTitle.includes('consumer')) {
    return 'ri-bar-chart-box-line text-4xl text-gray-400';
  } else if (lowerTitle.includes('supply') || lowerTitle.includes('chain')) {
    return 'ri-line-chart-line text-4xl text-gray-400';
  } else if (lowerTitle.includes('financial') || lowerTitle.includes('market')) {
    return 'ri-pie-chart-2-line text-4xl text-gray-400';
  } else {
    return 'ri-bar-chart-grouped-line text-4xl text-gray-400';
  }
}
