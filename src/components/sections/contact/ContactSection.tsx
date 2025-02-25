import { ContactButton, ContactIconButton } from "@components/buttons";
import GithubIcon from "../../../assets/icons/github.svg?react";
import LinkedInIcon from "../../../assets/icons/linkedin.svg?react";
import styles from "./ContactSection.module.scss";
import { GITHUB, LINKEDIN } from "src/conts";
export type ContactSectionProps = {
  onContactPressed: () => void;
};

export const ContactSection = ({ onContactPressed }: ContactSectionProps) => {
  const openUrl = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  return (
    <div className={styles["contact-section"]}>
      <ContactButton label="CONTACT ME" onClick={onContactPressed} />
      <ContactIconButton onClick={() => openUrl(LINKEDIN)}>
        <LinkedInIcon className={styles["logo-icon"]} />
      </ContactIconButton>
      <ContactIconButton onClick={() => openUrl(GITHUB)}>
        <GithubIcon className={styles["logo-icon"]} />
      </ContactIconButton>
    </div>
  );
};
