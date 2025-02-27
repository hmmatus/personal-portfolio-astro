import type { ButtonHTMLAttributes } from "react";
import styles from "./LogoButton.module.scss";
export interface LogoButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export const LogoButton = ({ children, ...props }: LogoButtonProps) => {
  return (
    <button
      {...props}
      className={`${props.className} ${styles["logo-button"]}`}
    >
      {children}
    </button>
  );
};
