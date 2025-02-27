import styles from "./CustomButton.module.scss";
interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const CustomButton = ({ className, ...rest }: CustomButtonProps) => {
  return (
    <button className={`${styles["custom-button"]} ${className}`} {...rest} />
  );
};
