import styles from "./HeroSection.module.scss";

interface HeroCtaProps {
  label: string;
}

export function HeroCta({ label }: HeroCtaProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const aboutSection = document.getElementById("about-section");
    if (!aboutSection) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    aboutSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={styles["hero-cta"]}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
