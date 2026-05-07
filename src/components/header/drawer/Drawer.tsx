import { useEffect } from "react";
import { NavLinks } from "../nav-links/NavLinks";
import styles from "./Drawer.module.scss";

type DrawerProps = {
  isOpen: boolean;
  onClick?: () => void;
  translations: {
    home: string;
    about: string;
    contact: string;
  };
};

export const Drawer = ({ isOpen, onClick, translations }: DrawerProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClick) {
        onClick();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClick]);

  return (
    <div
      className={`${styles["overlay"]} ${isOpen ? styles.open : styles.close}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
    >
      <div className={styles["drawer"]}>
        <NavLinks
          isMobile={true}
          onClick={onClick}
          translations={translations}
        />
      </div>
    </div>
  );
};
