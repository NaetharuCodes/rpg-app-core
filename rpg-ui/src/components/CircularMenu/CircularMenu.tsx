import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import styles from "./CircularMenu.module.css";

interface CircularMenuProps {
  triggerIcon: LucideIcon;
  items: Array<{
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  }>;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function CircularMenu({
  triggerIcon: TriggerIcon,
  items,
  theme = "default",
  className,
}: CircularMenuProps) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.container}>
      <ul
        className={`${styles.menu} ${isActive ? styles.active : ""} ${theme ? styles[theme] : ""} ${className || ""}`}
      >
        <div className={styles.menuToggle} onClick={handleToggle}>
          <TriggerIcon />
        </div>
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li key={index} style={{ "--i": index } as React.CSSProperties}>
              <button onClick={item.onClick}>
                <IconComponent />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
