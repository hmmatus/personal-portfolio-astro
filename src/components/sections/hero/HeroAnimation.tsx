import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import heroAnimation from "@assets/animations/hero_animation.json";
import styles from "./HeroSection.module.scss";

export function HeroAnimation() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={styles["hero-animation"]} aria-hidden="true">
      <Lottie
        animationData={heroAnimation}
        loop={!prefersReducedMotion}
        autoplay={!prefersReducedMotion}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
      />
    </div>
  );
}
