import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
        secondary: "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
        accent: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
        muted: "bg-muted/30 text-muted-foreground border-muted/30 hover:bg-muted/50",
      },
      size: {
        default: "px-3 py-1.5 text-xs",
        sm: "px-2 py-1 text-[10px]",
        lg: "px-4 py-2 text-sm",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 active:scale-95",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface UnifiedChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
}

const UnifiedChip = forwardRef<HTMLDivElement, UnifiedChipProps>(
  ({ className, variant, size, interactive, icon, children, ...props }, ref) => {
    return (
      <div
        className={cn(chipVariants({ variant, size, interactive, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    );
  }
);
UnifiedChip.displayName = "UnifiedChip";

export { UnifiedChip, chipVariants };