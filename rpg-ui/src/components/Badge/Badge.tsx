import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Genre/Game type colors
        fantasy:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        scifi:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        horror: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        mystery:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        historical:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        modern: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        // Additional colors
        green:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        yellow:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        md: "px-2.5 py-0.5 text-sm rounded-md",
        lg: "px-3 py-1 text-sm rounded-lg",
      },
      styleVariant: {
        subtle: "", // Default styling from variant
        solid: "font-semibold",
        outline: "bg-transparent border",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      styleVariant: "subtle",
    },
    compoundVariants: [
      // Outline style overrides for better contrast
      {
        styleVariant: "outline",
        variant: "fantasy",
        class:
          "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950",
      },
      {
        styleVariant: "outline",
        variant: "scifi",
        class:
          "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-950",
      },
      {
        styleVariant: "outline",
        variant: "horror",
        class:
          "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950",
      },
      {
        styleVariant: "outline",
        variant: "mystery",
        class:
          "border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950",
      },
      {
        styleVariant: "outline",
        variant: "historical",
        class:
          "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950",
      },
      {
        styleVariant: "outline",
        variant: "modern",
        class:
          "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
      },
    ],
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, styleVariant, icon: Icon, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, styleVariant }),
          className
        )}
        {...props}
      >
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
