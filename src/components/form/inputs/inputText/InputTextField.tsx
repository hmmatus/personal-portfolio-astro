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
  id,
  ...rest
}) => {
  return (
    <div className={`${styles["input-text-container"]} ${containerClassName}`}>
      <label htmlFor={id} className={styles["input-label"]}>
        {label}
      </label>
      <textarea id={id} className={styles["input-textarea"]} {...rest} />
      <span className={styles["input-error-message"]}>{errorMessage}</span>
    </div>
  );
};
