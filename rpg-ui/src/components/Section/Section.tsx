import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      size: {
        sm: "max-w-2xl",
        md: "max-w-4xl", 
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-none",
      },
      spacing: {
        none: "",
        sm: "py-8 md:py-12",
        md: "py-16 md:py-20",
        lg: "py-20 md:py-28",
      },
      background: {
        none: "",
        card: "bg-card",
        muted: "bg-muted/10",
        gradient: "bg-gradient-to-b from-card to-background",
        accent: "bg-gradient-to-b from-muted/10 to-background",
      },
      align: {
        left: "text-left",
        center: "text-center", 
        right: "text-right",
      }
    },
    defaultVariants: {
      size: "md",
      spacing: "md",
      background: "none",
      align: "left",
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  container?: boolean; // Whether to add the mx-auto px-4 container styling
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, size, spacing, background, align, container = true, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          sectionVariants({ size, spacing, background, align }),
          container && "mx-auto px-4 md:px-6",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section, sectionVariants };