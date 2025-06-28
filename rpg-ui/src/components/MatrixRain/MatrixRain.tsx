import { useEffect, useRef } from "react";
import styles from "./MatrixRain.module.css";

export function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Characters to use in the rain
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const columns = Math.floor(window.innerWidth / 20); // Column width ~20px

    // Create columns
    for (let i = 0; i < columns; i++) {
      const column = document.createElement("div");
      column.className = styles.matrixColumn;
      column.style.left = `${i * 20}px`;
      column.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2-5 seconds
      column.style.animationDelay = `${Math.random() * 2}s`; // 0-2 second delay

      // Generate random characters for this column
      let columnText = "";
      for (let j = 0; j < 20; j++) {
        columnText += chars[Math.floor(Math.random() * chars.length)] + "\n";
      }
      column.textContent = columnText;

      container.appendChild(column);
    }

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.matrixRain} />;
}
