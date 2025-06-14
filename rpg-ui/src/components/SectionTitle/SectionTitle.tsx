import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionTitleVariants = cva(
  "font-bold text-foreground",
  {
    variants: {
      level: {
        1: "text-3xl md:text-4xl mb-8",
        2: "text-2xl md:text-3xl mb-6",
        3: "text-xl md:text-2xl mb-4",
        4: "text-lg md:text-xl mb-3",
      },
      spacing: {
        none: "mb-0",
        sm: "mb-3",
        md: "mb-6", 
        lg: "mb-8",
        xl: "mb-12",
      }
    },
    defaultVariants: {
      level: 2,
      spacing: "md",
    },
  }
);

export interface SectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionTitleVariants> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, level, spacing, icon: Icon, children, as, ...props }, ref) => {
    // Determine the HTML element based on level or explicit 'as' prop
    const elementMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4'> = {
      1: 'h1',
      2: 'h2', 
      3: 'h3',
      4: 'h4'
    };
    
    const Component = as || elementMap[level || 2] || 'h2';
    
    return React.createElement(
      Component,
      {
        ref,
        className: cn(sectionTitleVariants({ level, spacing }), className),
        ...props
      },
      <>
        {Icon && (
          <Icon className="inline-block mr-3 h-8 w-8 text-current" />
        )}
        {children}
      </>
    );
  }
);

SectionTitle.displayName = "SectionTitle";

export { SectionTitle, sectionTitleVariants };