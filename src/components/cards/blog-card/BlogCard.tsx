import styles from "./BlogCard.module.scss";

export interface BlogCardPropsI {
  slug: string;
  title: string;
  date: Date;
  banner: string;
  description: string;
  lang?: string;
}

export function BlogCard({ slug, title, date, banner, description, lang }: BlogCardPropsI) {
  const href = lang && lang !== "en" ? `/${lang}/blog/${slug}` : `/blog/${slug}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a href={href} className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.banner}
          src={banner}
          alt={title}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <time className={styles.date} dateTime={date.toISOString()}>
          {formattedDate}
        </time>
        <p className={styles.description}>{description}</p>
      </div>
    </a>
  );
}
