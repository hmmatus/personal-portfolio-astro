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
  return (
    <div
      className={`${styles["overlay"]} ${isOpen ? styles.open : styles.close}`}
    >
      <div className={`${styles["drawer"]}`}>
        <NavLinks
          isMobile={true}
          onClick={onClick}
          translations={translations}
        />
      </div>
    </div>
  );
};
