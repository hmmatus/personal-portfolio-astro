import { EMAIL, RESUME } from "src/conts";
import { ConnectSection, FormHyperlink } from "./components";
import styles from "./FormSection.module.scss";

export const FormSection = () => {
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <section className={styles["form-section"]}>
      <div className={styles["form-section-header"]}>
        <h2>LET'S CONNECT</h2>
        <div className={styles["form-hyperlink-container"]}>
          <p>Say hello at </p>
          <FormHyperlink
            label={EMAIL}
            onClick={() => openLink(`mailto:${EMAIL}`)}
          />
        </div>
        <div className={styles["form-hyperlink-container"]}>
          <p>For more info, here's my </p>
          <FormHyperlink label="resume" onClick={() => openLink(RESUME)} />
        </div>
        <div className={styles["connect-section-container"]}>
          <ConnectSection />
        </div>
      </div>
      <div className={styles["form-section-body"]}></div>
    </section>
  );
};
