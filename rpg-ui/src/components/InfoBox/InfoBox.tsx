import { useState } from "react";
import styles from "./InfoBox.module.css";

interface InfoBoxProps {
  title: string;
  message: string;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function InfoBox({
  title,
  message,
  theme = "default",
  className,
}: InfoBoxProps) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.infoBox} ${isActive ? styles.active : ""} ${theme ? styles[theme] : ""} ${className || ""}`}
        onClick={handleToggle}
      >
        {isActive && (
          <div className={styles.content}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.message}>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
