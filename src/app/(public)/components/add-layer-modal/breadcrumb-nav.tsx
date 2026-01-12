import { ChevronRight, Globe } from 'lucide-react';
import { NavigationLevel, BreadcrumbItem } from './use-add-layer';
import { cn } from '@/lib/utils';

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (level: NavigationLevel | 'world') => void;
  currentLevel: NavigationLevel | 'world';
}

export const BreadcrumbNav = ({
  items,
  onNavigate,
  currentLevel,
}: BreadcrumbNavProps) => {
  // Filter out 'world' from items for the card display
  const displayItems = items.filter(item => item.level !== 'world');

  return (
    <div className="flex items-center gap-1.5 px-5 bg-muted/30 border-b border-border/50">
      <button
        onClick={() => onNavigate('world')}
        className={cn(
          "flex items-center justify-center p-1.5 rounded-md transition-all",
          currentLevel === 'world'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="World"
      >
        <Globe className="h-4 w-4" />
      </button>

      {displayItems.length > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />}

      {displayItems.map((item, index) => (
        <div key={`${item.level}-${index}`} className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate(item.level)}
            className={cn(
              "flex flex-col items-start px-2.5 py-1 rounded-md border transition-all min-w-[70px]",
              currentLevel === item.level
                ? "bg-background shadow-sm"
                : "bg-background/50 border-border hover:border-primary/40 hover:bg-background"
            )}
          >
            <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold leading-none mb-0.5">
              {item.level}
            </span>
            <span className={cn(
              "text-[11px] font-semibold truncate max-w-[100px]",
              currentLevel === item.level ? "text-primary" : "text-foreground"
            )}>
              {item.label}
            </span>
          </button>

          {index < displayItems.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          )}
        </div>
      ))}
    </div>
  );
};
