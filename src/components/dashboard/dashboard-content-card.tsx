import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface DashboardContentCardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const DashboardContentCard = ({
  children,
  className,
  contentClassName,
}: DashboardContentCardProps) => {
  return (
    <Card className={cn("border-none p-0", className)}>
      <CardContent className={cn("flex flex-col p-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardContentCard;
