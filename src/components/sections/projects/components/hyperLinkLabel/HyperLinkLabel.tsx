import React from "react";
import styles from "./HyperLinkLabel.module.scss";
export interface Props {
  label: string;
  url: string;
  icon?: string;
}

export const HyperLinkLabel: React.FC<Props> = ({ label, url, icon }) => {
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
