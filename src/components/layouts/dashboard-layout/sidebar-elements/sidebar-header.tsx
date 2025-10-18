"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import appConfig from "@/config/app-config";
import Image from "next/image";

const SidebarHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent"
        >
          <div className="bg-muted border-border flex aspect-square size-8 items-center justify-center rounded-lg border">
            <Image
              src={appConfig.appLogo}
              alt={appConfig.appName}
              width={32}
              height={32}
            />
          </div>

          <Text size="sm" weight={500}>
            {appConfig.appName}
          </Text>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarHeader;
