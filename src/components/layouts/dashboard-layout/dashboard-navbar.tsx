import { LanguageDropdown } from "@/components/language-dropdown";
import { ModeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardNavbar = () => {
  return (
    <header className="flex h-16 border-b bg-accent/20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        {/* <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        /> */}

        {/* Breadcrumbs */}
        {/* <DashboardBreadcrumbs /> */}

        <div className="flex-1" />

        <ModeToggle />

        <LanguageDropdown />
      </div>
    </header>
  );
};

export default DashboardNavbar;
