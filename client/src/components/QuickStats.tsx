import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 60000, // 1 minute
  });

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon="ri-database-2-line"
          iconColor="text-primary"
          iconBg="bg-primary-50"
          title="Datasets"
          value={isLoading ? undefined : stats?.datasets || 0}
        />
        <StatCard
          icon="ri-chat-3-line"
          iconColor="text-green-600"
          iconBg="bg-green-50"
          title="Conversations"
          value={isLoading ? undefined : stats?.conversations || 0}
        />
        <StatCard
          icon="ri-line-chart-line"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          title="Insights Generated"
          value={isLoading ? undefined : stats?.insights || 0}
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  value?: number;
};

function StatCard({ icon, iconColor, iconBg, title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBg} rounded-md p-3`}>
            <i className={`${icon} ${iconColor} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                {value !== undefined ? (
                  <div className="text-lg font-medium text-gray-900">{value}</div>
                ) : (
                  <Skeleton className="h-6 w-12" />
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
