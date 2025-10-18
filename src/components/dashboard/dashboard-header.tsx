import { cn } from "@/lib/utils";
import { Text } from "../ui/text";

interface HeadingProps {
  title: string;
  description: string;
  className?: string;
}

const DashboardHeader: React.FC<HeadingProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("mb-2", className)}>
      <Text size="2xl" weight={600} className="mb-1">
        {title}
      </Text>

      <Text size="sm" weight={400} className="text-muted-foreground">
        {description}
      </Text>
    </div>
  );
};

export default DashboardHeader;
