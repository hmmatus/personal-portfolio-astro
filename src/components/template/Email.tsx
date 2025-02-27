import styles from "./Email.module.scss";
export type EmailProps = {
  from: string;
  subject: string;
  message: string;
};

export const Email = ({ from, subject, message }: EmailProps) => {
  return (
    <div className={styles["email-container"]}>
      <h1>{`${from} te ha enviado un correo`}</h1>
      <h2>{`Asunto: ${subject}`}</h2>
      <p>{message}</p>
    </div>
  );
};
