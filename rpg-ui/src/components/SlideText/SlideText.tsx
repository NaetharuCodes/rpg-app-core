import React from "react";
import styles from "./SlideText.module.css";

interface SlideTextProps {
  text: string;
  theme?: "default" | "cyberpunk";
  fontSize?: string;
  animationDuration?: string;
  className?: string;
}

export function SlideText({
  text,
  theme,
  fontSize = "60px",
  animationDuration = "6s",
  className,
}: SlideTextProps) {
  const style = {
    fontSize,
    "--animation-duration": animationDuration,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <h2
        data-text={text}
        className={`${styles.slideText} ${theme ? styles[theme] : ""} ${className || ""}`}
        style={style}
      >
        {text}
      </h2>
    </div>
  );
}
