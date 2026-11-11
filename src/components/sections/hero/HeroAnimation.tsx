import { useEffect, useRef, useState } from "react";
import { useLottie } from "lottie-react";
import heroAnimation from "@assets/animations/hero_animation.json";
import styles from "./HeroSection.module.scss";

export function HeroAnimation() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const animation = useLottie({
    src: heroAnimation,
    loop: !prefersReducedMotion,
    autoplay: !prefersReducedMotion,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });
  const animationRef = useRef(animation);
  animationRef.current = animation;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) animationRef.current.pause();
      else animationRef.current.play();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      className={styles["hero-animation"]}
      aria-hidden="true"
      ref={animation.setDisplayRef}
    />
  );
}
