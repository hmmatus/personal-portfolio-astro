import styles from "./InputText.module.scss";
export interface InputTextFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  containerClassName?: string;
  errorMessage?: string;
}
export const InputTextField: React.FC<InputTextFieldProps> = ({
  label,
  containerClassName,
  errorMessage,
  ...rest
}) => {
  return (
    <div className={`${styles["input-text-container"]} ${containerClassName}`}>
      <span className={styles["input-label"]}>{label}</span>
      <textarea className={styles["input-textarea"]} {...rest} />
      <span className={styles["input-error-message"]}>{errorMessage}</span>
    </div>
  );
};
