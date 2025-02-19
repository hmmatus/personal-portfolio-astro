import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./ContactButton.module.scss";
import Circle from "../../../assets/icons/circle.svg?react"; // Based on solution https://doray.me/articles/use-svgs-as-react-components-in-astro-MNUvh

interface ContactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
export const ContactButton = ({ label, ...rest }: ContactButtonProps) => {
  return (
    <button className={`${rest.className} ${styles.button}`} {...rest}>
      <p className={styles.label}>{label}</p>
      <Circle className={styles["contact-icon"]} />
    </button>
  );
};
