import styles from "./ContactButton.module.scss";
export const ContactIconButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={() => {
        console.log("clicked");
        onClick();
      }}
      className={styles["icon-button"]}
    >
      {children}
    </button>
  );
};
