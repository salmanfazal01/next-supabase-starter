"use client";

import { UsersDataTable } from "@/components/admin/all-users-list/users-data-table";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfiles, useProfilesCount } from "@/hooks/supabase/use-profile";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const DashboardAllUsersPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const offset = page * pageSize;

  const { data: users, isLoading, error } = useProfiles(pageSize, offset);
  const { data: totalCount } = useProfilesCount();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <AlertCircle className="text-destructive h-10 w-10" />
            <h3 className="text-lg font-semibold">Error loading users</h3>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <DashboardHeader
        title="All Users"
        description="Manage user accounts, roles, and permissions"
      />

      <UsersDataTable
        data={users || []}
        page={page}
        pageSize={pageSize}
        totalUsers={totalCount || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default DashboardAllUsersPage;
