import React from "react";
import { Image } from "astro:assets";
import styles from "./HyperLinkLabel.module.scss";
export interface Props {
  key: string;
  label: string;
  url: string;
  icon?: string;
}

export const HyperLinkLabel: React.FC<Props> = ({ label, url, icon, key }) => {
  const onClick = () => {
    window.open(url, "_blank");
  };
  return (
    <button onClick={onClick} className={styles["hyperlink-label"]}>
      {label}
      {icon && <img className={styles.logo} src={icon} />}
    </button>
  );
};
