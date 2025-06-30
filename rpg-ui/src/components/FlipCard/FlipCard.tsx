import { type LucideIcon } from "lucide-react";
import styles from "./FlipCard.module.css";

interface FlipCardProps {
  frontTitle: string;
  frontText: string;
  backTitle: string;
  backText: string;
  frontIcon?: LucideIcon;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function FlipCard({
  frontTitle,
  frontText,
  backTitle,
  backText,
  frontIcon: FrontIcon,
  theme = "default",
  className,
}: FlipCardProps) {
  return (
    <div
      className={`${styles.flipCard} ${theme ? styles[theme] : ""} ${className || ""}`}
    >
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          {FrontIcon && <FrontIcon className={styles.icon} />}
          <h2>{frontTitle}</h2>
          <p>{frontText}</p>
        </div>
        <div className={styles.flipCardBack}>
          <h2>{backTitle}</h2>
          <p>{backText}</p>
        </div>
      </div>
    </div>
  );
}
