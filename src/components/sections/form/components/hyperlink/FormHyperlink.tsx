import styles from "./FormHyperlink.module.scss";
type Props = {
  label: string;
  onClick: () => void;
};
export const FormHyperlink: React.FC<Props> = ({ label, onClick }) => {
  return (
    <p className={styles["form-hyperlink"]} onClick={onClick}>
      {label}
    </p>
  );
};
