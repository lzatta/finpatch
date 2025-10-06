interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionComponent?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, description, actionComponent }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex bg-muted p-3 rounded-lg">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {actionComponent}
    </div>
  );
}
