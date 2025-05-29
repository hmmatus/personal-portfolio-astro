import styles from "./NavLinks.module.scss";
type NavLinksProps = {
  isMobile: boolean;
  onClick?: () => void;
};
export const NavLinks = ({ isMobile, onClick }: NavLinksProps) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onClick) onClick();
  };

  return (
    <nav>
      <ul
        className={`${styles["nav-links"]} ${
          isMobile ? styles.mobile : styles.desktop
        }`}
      >
        <li>
          <a href="/" onClick={handleHomeClick}>
            Home
          </a>
        </li>
        <li>
          <a href="#about-section" onClick={onClick}>
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
