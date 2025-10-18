import { AppSidebar } from "@/components/layouts/dashboard-layout/app-sidebar";
import DashboardNavbar from "@/components/layouts/dashboard-layout/dashboard-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <DashboardNavbar />

        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
