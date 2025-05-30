import styles from "./NavLinks.module.scss";

type NavLinksProps = {
  isMobile: boolean;
  onClick?: () => void;
  translations: {
    home: string;
    about: string;
    contact: string;
  };
};

export const NavLinks = ({
  isMobile,
  onClick,
  translations,
}: NavLinksProps) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
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
            {translations.home}
          </a>
        </li>
        <li>
          <a href="#about-section" onClick={onClick}>
            {translations.about}
          </a>
        </li>
        <li>
          <a href="#form-section" onClick={onClick}>
            {translations.contact}
          </a>
        </li>
      </ul>
    </nav>
  );
};
