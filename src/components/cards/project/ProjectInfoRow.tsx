import styles from "./ProjectInfoRow.module.scss";

export interface ProjectInfoRowPropsI {
  title: string;
  description: string;
}

export function ProjectInfoRow({ title, description }: ProjectInfoRowPropsI) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{title}</span>
      <span className={styles.value}>{description}</span>
    </div>
  );
}
