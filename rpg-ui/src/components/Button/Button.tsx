import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border border-border text-foreground hover:bg-accent hover:text-accent-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
        xl: "h-14 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: 'button' | 'link';
  href?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    as = 'button',
    href,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    loading = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = as === 'link' ? 'a' : 'button';
    
    const content = (
      <>
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {LeftIcon && !loading && <LeftIcon className="mr-2 h-4 w-4" />}
        {children}
        {RightIcon && !loading && <RightIcon className="ml-2 h-4 w-4" />}
      </>
    );

    if (as === 'link') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };