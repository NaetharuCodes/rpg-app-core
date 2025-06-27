import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import styles from "./ExpandingMenu.module.css";

interface ExpandingMenuProps {
  triggerIcon: LucideIcon;
  items: Array<{
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  }>;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function ExpandingMenu({
  triggerIcon: TriggerIcon,
  items,
  className,
  theme,
}: ExpandingMenuProps) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.container}>
      <ul
        className={`${styles.expandingMenu} ${isActive ? styles.active : ""} ${theme ? styles[theme] : ""} ${className || ""}`}
      >
        <div className={styles.menuToggle} onClick={handleToggle}>
          <TriggerIcon />
        </div>
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li
              key={index}
              style={{ "--i": index + 1 } as React.CSSProperties}
              onClick={item.onClick}
            >
              <IconComponent />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
