import styles from "./NavLinks.module.scss";
type NavLinksProps = {
  isMobile: boolean;
  onClick?: () => void;
};
export const NavLinks = ({ isMobile, onClick }: NavLinksProps) => {
  return (
    <nav>
      <ul
        className={`${styles["nav-links"]} ${
          isMobile ? styles.mobile : styles.desktop
        }`}
      >
        <li>
          <a href="/" onClick={onClick}>
            Home
          </a>
        </li>
        <li>
          <a href="/about" onClick={onClick}>
            About
          </a>
        </li>
        <li>
          <a href="#form-section" onClick={onClick}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};
