import { ContactIconButton } from "@components/buttons";
import styles from "./ConnectSection.module.scss";
import LinkedInIcon from "@assets/icons/linkedin.svg?react";
import GithubIcon from "@assets/icons/github.svg?react";
import { GITHUB, LINKEDIN } from "src/consts/social-media-links";
export const ConnectSection = () => {
  const openUrl = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  return (
    <div className={styles["connect-section"]}>
      <ContactIconButton
        aria-label="Linkedin profile"
        onClick={() => openUrl(LINKEDIN)}
      >
        <LinkedInIcon className={styles["logo-icon"]} />
      </ContactIconButton>
      <ContactIconButton
        aria-label="Github profile"
        onClick={() => openUrl(GITHUB)}
      >
        <GithubIcon className={styles["logo-icon"]} />
      </ContactIconButton>
    </div>
  );
};
