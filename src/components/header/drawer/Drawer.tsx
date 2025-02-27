import { NavLinks } from "../nav-links/NavLinks";
import styles from "./Drawer.module.scss";
type DrawerProps = {
  isOpen: boolean;
};
export const Drawer = ({ isOpen }: DrawerProps) => {
  return (
    <div
      className={`${styles["drawer-container"]} ${
        isOpen ? styles.open : styles.close
      }`}
    >
      <NavLinks isMobile={true} />
    </div>
  );
};
