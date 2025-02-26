import type React from "react";
import styles from "./InputText.module.scss";
export interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  errorMessage?: string;
}
export const InputText: React.FC<InputTextProps> = ({
  label,
  containerClassName,
  errorMessage,
  ...rest
}) => {
  return (
    <div className={`${styles["input-text-container"]} ${containerClassName}`}>
      <span className={styles["input-label"]}>{label}</span>
      <input className={styles["input-text"]} type="text" {...rest} />
      <span className={styles["input-error-message"]}>{errorMessage}</span>
    </div>
  );
};
