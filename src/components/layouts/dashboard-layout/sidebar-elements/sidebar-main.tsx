"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  FileText,
  SquareTerminal,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
}

interface SidebarMenuItem extends MenuItem {
  nestedItems?: MenuItem[];
}

interface SidebarGroup {
  groupLabel?: string;
  items: SidebarMenuItem[];
}

const sidebarData: SidebarGroup[] = [
  {
    items: [
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
      {
        title: "My Posts",
        url: "/dashboard/my-posts",
        icon: FileText,
      },
    ],
  },
  {
    items: [
      {
        title: "Admin",
        icon: SquareTerminal,
        isActive: true,
        nestedItems: [
          {
            title: "All Users",
            icon: Users,
            url: "/dashboard/all-users",
          },
          {
            title: "All Posts",
            icon: FileText,
            url: "/dashboard/all-posts",
          },
        ],
      },
    ],
  },
];

const SidebarMenuItemElement = ({ item }: { item: SidebarMenuItem }) => {
  const pathname = usePathname();
  const isActive = Boolean(item.url && pathname === item.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url || ""}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMain = () => {
  return (
    <>
      {sidebarData.map((group, i) => (
        <SidebarGroup key={i}>
          {group.groupLabel && (
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
          )}

          <SidebarMenu>
            {group.items.map((item) => {
              if (!item.nestedItems) {
                return <SidebarMenuItemElement key={item.title} item={item} />;
              }

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.nestedItems.map((subItem) => (
                          <SidebarMenuItemElement
                            key={subItem.title}
                            item={subItem}
                          />
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarMain;
