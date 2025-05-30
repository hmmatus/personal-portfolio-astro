import { ContactButton, ContactIconButton } from "@components/buttons";
import GithubIcon from "../../../assets/icons/github.svg?react";
import LinkedInIcon from "../../../assets/icons/linkedin.svg?react";
import styles from "./ContactSection.module.scss";
import { GITHUB, LINKEDIN } from "src/consts/social-media-links";

export const ContactSection = () => {
  const openUrl = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  const onContactPressed = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className={styles["contact-section"]}>
      <ContactButton
        aria-label="Contact me"
        label="CONTACT ME"
        onClick={onContactPressed}
      />
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
