import type { ExperienceI } from "@types/experience";
import styles from "./ExperienceCard.module.scss";

export interface ExperienceCardPropsI {
  item: ExperienceI;
  className?: string;
}

export function ExperienceCard({ item, className }: ExperienceCardPropsI) {
  const { title, company, description, startDate, endDate } = item;

  return (
    <div className={`${styles["experience-card"]} ${className ?? ""}`}>
      <div className={styles["flex-row-between"]}>
        <span className={styles["experience-title"]}>{title}</span>
        <p>{`${startDate} - ${endDate}`}</p>
      </div>
      <span className={styles["experience-subtitle"]}>{company}</span>
      <p>{description}</p>
    </div>
  );
}
