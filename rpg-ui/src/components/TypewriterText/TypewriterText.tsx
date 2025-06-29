import React, { useState, useEffect } from "react";
import styles from "./TypewriterText.module.css";

interface TypewriterTextProps {
  text: string;
  theme?: "default" | "horror";
  fontSize?: string;
  speed?: number; // milliseconds between characters
  className?: string;
}

export function TypewriterText({
  text,
  theme = "default",
  fontSize = "4rem",
  speed = 100,
  className,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Typing phase
      const randomDelay = speed + Math.random() * 100; // More variation
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, randomDelay);

      return () => clearTimeout(timer);
    } else {
      // Pause at end, then restart
      const pauseTimer = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
      }, 3000); // 3 second pause before restarting

      return () => clearTimeout(pauseTimer);
    }
  }, [currentIndex, text, speed]);

  const style = {
    fontSize,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <h2
        className={`${styles.typewriterText} ${theme ? styles[theme] : ""} ${className || ""}`}
        style={style}
      >
        {displayedText}
        <span
          className={`${styles.cursor} ${showCursor ? styles.visible : ""}`}
        >
          |
        </span>
      </h2>
    </div>
  );
}
