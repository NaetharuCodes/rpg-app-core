import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Dice6 } from "lucide-react";

const heroVariants = cva("w-full", {
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
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    align: "center",
  },
});

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {
  children: React.ReactNode;
  container?: boolean; // Whether to add the container styling
  bordered?: boolean; // Whether to add bottom border
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      variant,
      size,
      align,
      container = true,
      bordered = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          heroVariants({ variant, size, align }),
          bordered && "border-b border-border",
          "relative overflow-hidden", // Add this
          className
        )}
        {...props}
      >
        {/* Floating D6 Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Dice6 className="absolute top-[20%] left-[10%] w-10 h-10 text-accent opacity-20 animate-float-rotate" />
          <Dice6 className="absolute top-[60%] left-[80%] w-8 h-8 text-accent opacity-15 animate-bounce" />
          <Dice6 className="absolute top-[30%] right-[15%] w-12 h-12 text-accent opacity-10 animate-float-rotate-reverse" />
          <Dice6 className="absolute bottom-[40%] left-[20%] w-6 h-6 text-accent opacity-25 animate-pulse" />
          <Dice6 className="absolute bottom-[20%] right-[25%] w-9 h-9 text-accent opacity-15 animate-float-rotate" />
        </div>
        {container ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            {children}
          </div>
        ) : (
          <div className="relative z-10">{children}</div>
        )}
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero, heroVariants };
