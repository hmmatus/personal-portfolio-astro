import styles from "./NavLinks.module.scss";
type NavLinksProps = {
  isMobile: boolean;
};
export const NavLinks = ({ isMobile }: NavLinksProps) => {
  return (
    <nav>
      <ul
        className={`${styles["nav-links"]} ${
          isMobile ? styles.mobile : styles.desktop
        }`}
      >
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/#form-section">Contact</a>
        </li>
      </ul>
    </nav>
  );
};
