import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./ContactButton.module.scss";

interface ContactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
export const ContactButton = ({ label, ...rest }: ContactButtonProps) => {
  return <button {...rest}>{label}</button>;
};
