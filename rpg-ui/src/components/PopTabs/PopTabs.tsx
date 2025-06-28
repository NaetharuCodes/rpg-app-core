import { useState } from "react";
import styles from "./PopTabs.module.css";

interface PopTabsProps {
  tabs: Array<{
    label: string;
    onClick?: () => void;
  }>;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function PopTabs({ tabs, theme = "default", className }: PopTabsProps) {
  const [expandedTabs, setExpandedTabs] = useState<Set<number>>(new Set());

  const handleTabClick = (index: number) => {
    const newExpandedTabs = new Set(expandedTabs);
    if (expandedTabs.has(index)) {
      newExpandedTabs.delete(index);
    } else {
      newExpandedTabs.add(index);
    }
    setExpandedTabs(newExpandedTabs);
    tabs[index]?.onClick?.();
  };

  // Limit to 6 tabs maximum
  const displayTabs = tabs.slice(0, 6);

  return (
    <div
      className={`${styles.container} ${theme ? styles[theme] : ""} ${className || ""}`}
    >
      {displayTabs.map((tab, index) => (
        <div
          key={index}
          className={`${styles.tab} ${expandedTabs.has(index) ? styles.expanded : ""}`}
          onClick={() => handleTabClick(index)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
