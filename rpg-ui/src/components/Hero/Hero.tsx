import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const heroVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-card to-background",
        solid: "bg-card",
        muted: "bg-muted",
        accent: "bg-gradient-to-r from-accent/10 to-accent/5",
      },
      size: {
        sm: "py-12 md:py-16",
        md: "py-16 md:py-24", 
        lg: "py-24 md:py-32",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      align: "center",
    },
  }
);

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {
  children: React.ReactNode;
  container?: boolean; // Whether to add the container styling
  bordered?: boolean; // Whether to add bottom border
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ className, variant, size, align, container = true, bordered = true, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          heroVariants({ variant, size, align }),
          bordered && "border-b border-border",
          className
        )}
        {...props}
      >
        {container ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero, heroVariants };