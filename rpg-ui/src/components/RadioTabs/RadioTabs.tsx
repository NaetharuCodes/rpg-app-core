import React from "react";
import styles from "./RadioTabs.module.css";

interface RadioTabsProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  theme?: "default" | "cyberpunk";
  className?: string;
}

export function RadioTabs({
  options,
  value,
  defaultValue,
  onChange,
  name,
  theme,
  className,
}: RadioTabsProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <div
      className={`${styles.radioGroup} ${theme ? styles[theme] : ""} ${className || ""}`}
    >
      {options.map((option) => (
        <React.Fragment key={option.value}>
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value ? value === option.value : undefined}
            defaultChecked={
              defaultValue ? defaultValue === option.value : undefined
            }
            onChange={() => handleChange(option.value)}
            className={styles.customRadio}
          />
          <label htmlFor={`${name}-${option.value}`} className={styles.label}>
            {option.label}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
