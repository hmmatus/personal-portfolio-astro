import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ChevronLeftIcon from "@assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "@assets/icons/chevron-right.svg?react";
import styles from "./Carousel.module.scss";

export interface CarouselPropsI {
  items: ReactNode[];
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
  slideLabel?: (index: number, total: number) => string;
}

export function Carousel({
  items,
  ariaLabel,
  prevLabel,
  nextLabel,
  slideLabel,
}: CarouselPropsI) {
  const [activeIndex, setActiveIndex] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const carouselId = useId();
  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(index, total - 1)));
    },
    [total]
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!regionRef.current?.contains(document.activeElement)) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;

    if (deltaX === undefined || Math.abs(deltaX) < 40) return;

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  if (total === 0) return null;

  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex === total - 1;

  return (
    <div
      ref={regionRef}
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.viewport}>
        <ul
          className={styles.track}
          style={{ transform: `translateX(calc(-1 * var(--slide-offset) * ${activeIndex}))` }}
          aria-live="polite"
        >
          {items.map((item, index) => (
            <li
              key={index}
              id={`${carouselId}-slide-${index}`}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={
                slideLabel
                  ? slideLabel(index + 1, total)
                  : `${index + 1} / ${total}`
              }
              aria-hidden={index !== activeIndex}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goPrev}
          disabled={isAtStart}
          aria-label={prevLabel}
          aria-controls={`${carouselId}-slide-${activeIndex}`}
        >
          <ChevronLeftIcon className={styles.navIcon} aria-hidden="true" />
        </button>

        <div className={styles.dots} role="tablist" aria-label={ariaLabel}>
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={styles.dot}
              data-active={index === activeIndex}
              onClick={() => goTo(index)}
              aria-label={
                slideLabel
                  ? slideLabel(index + 1, total)
                  : `${index + 1} / ${total}`
              }
              aria-selected={index === activeIndex}
              aria-controls={`${carouselId}-slide-${index}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={goNext}
          disabled={isAtEnd}
          aria-label={nextLabel}
          aria-controls={`${carouselId}-slide-${activeIndex}`}
        >
          <ChevronRightIcon className={styles.navIcon} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
