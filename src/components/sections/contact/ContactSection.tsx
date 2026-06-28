import { ContactButton } from "@components/buttons";
import GithubIcon from "../../../assets/icons/github.svg?react";
import LinkedInIcon from "../../../assets/icons/linkedin.svg?react";
import styles from "./ContactSection.module.scss";
import { GITHUB, LINKEDIN } from "src/consts/social-media-links";

export const ContactSection = () => {
  const onContactPressed = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      formSection.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <div className={styles["contact-section"]}>
      <ContactButton
        aria-label="Contact me"
        label="CONTACT ME"
        onClick={onContactPressed}
      />
      <a
        href={LINKEDIN}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="LinkedIn profile"
        className={styles["icon-link"]}
      >
        <LinkedInIcon aria-hidden="true" className={styles["logo-icon"]} />
      </a>
      <a
        href={GITHUB}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="GitHub profile"
        className={styles["icon-link"]}
      >
        <GithubIcon aria-hidden="true" className={styles["logo-icon"]} />
      </a>
    </div>
  );
};
