import { cn } from '@/lib/utils';
import { Option } from '@/lib/store/selection-store';

interface RegionCardProps {
  item: Option;
  isSelected: boolean;
  onClick: (item: Option) => void;
}

export const RegionCard = ({ item, isSelected, onClick }: RegionCardProps) => {
  return (
    <button
      onClick={() => onClick(item)}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer',
        'hover:border-primary hover:bg-accent/50',
        isSelected
          ? 'border-primary bg-primary/10 shadow-md'
          : 'border-border bg-background'
      )}
    >
      {/* Item Name */}
      <p className="font-semibold text-sm text-center truncate w-full">
        {item.name}
      </p>

      {/* Item Code/Code Badge */}
      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
        {item.code}
      </p>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  );
};
