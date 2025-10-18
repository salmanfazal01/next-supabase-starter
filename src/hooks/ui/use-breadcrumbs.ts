"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

// Route configuration for breadcrumbs
const routeConfig: Record<string, { label: string; parent?: string }> = {
  "/dashboard": { label: "Dashboard" },
  "/dashboard/profile": { label: "Profile", parent: "/dashboard" },
  "/dashboard/my-posts": { label: "My Posts", parent: "/dashboard" },
  "/dashboard/all-users": { label: "All Users", parent: "/dashboard" },
  "/dashboard/all-posts": { label: "All Posts", parent: "/dashboard" },
  "/dashboard/(admin)": { label: "Admin", parent: "/dashboard" },
  "/dashboard/(admin)/all-users": {
    label: "All Users",
    parent: "/dashboard/(admin)",
  },
  "/dashboard/(admin)/all-posts": {
    label: "All Posts",
    parent: "/dashboard/(admin)",
  },
};

/**
 * Hook to generate breadcrumb items based on the current route
 * @returns Array of breadcrumb items with labels and hrefs
 */
export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Handle dashboard routes
    if (pathname.startsWith("/dashboard")) {
      // Find matching route configuration
      const routeConfig = getRouteConfig(pathname);
      if (routeConfig) {
        // Add parent routes if they exist
        if (routeConfig.parent) {
          const parentConfig = getRouteConfig(routeConfig.parent);
          if (parentConfig) {
            // Check if this is the dashboard root - if so, make it unclickable
            const isDashboardRoot = routeConfig.parent === "/dashboard";
            breadcrumbs.push({
              label: parentConfig.label,
              href: isDashboardRoot ? undefined : routeConfig.parent,
            });
          }
        }

        // Add current page (without href since it's the current page)
        breadcrumbs.push({
          label: routeConfig.label,
          isCurrentPage: true,
        });
      } else {
        // Fallback: use pathname segments
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length > 1) {
          const lastSegment = segments[segments.length - 1];
          const label = formatSegmentLabel(lastSegment);
          breadcrumbs.push({
            label,
            isCurrentPage: true,
          });
        } else if (pathname === "/dashboard") {
          // Handle dashboard root route
          breadcrumbs.push({
            label: "Dashboard",
            isCurrentPage: true,
          });
        }
      }
    } else {
      // For non-dashboard routes, just show the current page
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        const label = formatSegmentLabel(lastSegment);
        breadcrumbs.push({
          label,
          isCurrentPage: true,
        });
      }
    }

    return breadcrumbs;
  }, [pathname]);
};

/**
 * Get route configuration for a given pathname
 */
function getRouteConfig(
  pathname: string,
): { label: string; parent?: string } | null {
  // Direct match
  if (routeConfig[pathname]) {
    return routeConfig[pathname];
  }

  // Check for dynamic routes (like (admin) routes)
  for (const [route, config] of Object.entries(routeConfig)) {
    if (route.includes("(") && route.includes(")")) {
      // Convert route pattern to regex
      const routePattern = route.replace(/\([^)]+\)/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(pathname)) {
        return config;
      }
    }
  }

  return null;
}

/**
 * Format a URL segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
