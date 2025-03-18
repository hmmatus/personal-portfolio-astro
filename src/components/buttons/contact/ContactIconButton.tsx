import styles from "./ContactButton.module.scss";

export interface ContactIconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}
export const ContactIconButton = ({
  children,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={styles["icon-button"]} {...rest}>
      {children}
    </button>
  );
};
