import styles from "./FormHyperlink.module.scss";

type Props = {
  label: string;
  href: string;
};

export const FormHyperlink: React.FC<Props> = ({ label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={styles["form-hyperlink"]}
    >
      {label}
    </a>
  );
};
