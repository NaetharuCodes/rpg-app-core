import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border border-border",
        elevated: "bg-card border border-border shadow-sm",
        ghost: "bg-transparent",
        feature: "bg-background border-0", // For feature cards like on homepage
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        lift: "hover:shadow-lg",
        scale: "hover:scale-105",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: "none",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'gradient' | 'solid';
  size?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardIcon = React.forwardRef<HTMLDivElement, CardIconProps>(
  ({ className, icon: Icon, variant = 'default', size = 'md', ...props }, ref) => {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
    };

    const iconVariants = {
      default: 'bg-muted',
      gradient: 'bg-gradient-to-br from-accent to-accent/70',
      solid: 'bg-accent',
    };

    const iconContentSizes = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          iconSizes[size],
          iconVariants[variant],
          "rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-105",
          className
        )}
        {...props}
      >
        <Icon className={cn(
          iconContentSizes[size],
          variant === 'gradient' || variant === 'solid' ? 'text-accent-foreground' : 'text-foreground'
        )} />
      </div>
    );
  }
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardIcon.displayName = "CardIcon";

export { Card, CardHeader, CardContent, CardIcon, cardVariants };