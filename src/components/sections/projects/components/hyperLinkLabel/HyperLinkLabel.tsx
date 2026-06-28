import React from "react";
import styles from "./HyperLinkLabel.module.scss";

export interface Props {
  label: string;
  url: string;
  icon?: string;
}

export const HyperLinkLabel: React.FC<Props> = ({ label, url, icon }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={styles["hyperlink-label"]}
    >
      {label}
      {icon && (
        <img
          className={styles.logo}
          src={icon}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
        />
      )}
    </a>
  );
};
