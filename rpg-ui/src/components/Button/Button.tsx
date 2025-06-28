import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "default" | "cyberpunk" | "glitch" | "neon";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  theme = "default",
  children,
  className,
  ...props
}: ButtonProps) {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${theme !== "default" ? styles[theme] : ""} ${className || ""}`;
  return (
    <button className={buttonClasses} data-text={children} {...props}>
      {children}
    </button>
  );
}
