import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  actionComponent?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, actionComponent, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl", className)}>
      <div className="bg-muted p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-xs">{description}</p>
      {actionComponent ? actionComponent : action && <Button onClick={action.onClick}>{action.text}</Button>}
    </div>
  );
}
