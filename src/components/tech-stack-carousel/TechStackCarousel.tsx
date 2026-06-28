import { techStackItems } from "@data/tech-stack";
import styles from "./TechStackCarousel.module.scss";
import { techStackIconMap } from "./tech-stack-icons";

function TechStackItem({ label, icon }: { label: string; icon: string }) {
  const src = techStackIconMap[icon];

  if (!src) return null;

  return (
    <li className={styles["carousel-item"]} aria-label={label}>
      <span className={styles["carousel-item-icon"]} aria-hidden="true">
        <img
          src={src}
          alt=""
          className={styles["carousel-item-image"]}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </span>
    </li>
  );
}

export function TechStackCarousel() {
  const items = [...techStackItems, ...techStackItems];

  return (
    <div className={styles["carousel-wrapper"]}>
      <ul className={styles["carousel-track"]} role="list">
        {items.map((item, index) => (
          <TechStackItem
            key={`${item.slug}-${index}`}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </ul>
    </div>
  );
}
