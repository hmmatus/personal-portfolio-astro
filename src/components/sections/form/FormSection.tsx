import { EMAIL, RESUME } from "src/conts";
import { ConnectSection, FormHyperlink } from "./components";
import styles from "./FormSection.module.scss";
import { InputText, InputTextField } from "@components/form";
import { useForm } from "react-hook-form";
import { CustomButton } from "@components/buttons";
type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
export const FormSection = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };
  const onSubmit = async (data: FormData) => {
    try {
      const options = {
        from: EMAIL,
        to: EMAIL,
        subject: data.subject,
        message: data.message,
      };
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the message.");
    }
  };
  return (
    <section id="form-section" className={styles["form-section"]}>
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
      <div className={styles["form-section-body"]}>
        <InputText
          label={"Name"}
          {...register("name")}
          onChange={(e) => setValue("name", e.target.value)}
          errorMessage=""
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          label={"Email"}
          {...register("email")}
          onChange={(e) => setValue("email", e.target.value)}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          label={"Subject"}
          {...register("subject")}
          onChange={(e) => setValue("subject", e.target.value)}
          containerClassName={styles["form-section-input"]}
        />
        <InputTextField
          label={"Message"}
          {...register("message")}
          onChange={(e) => setValue("message", e.target.value)}
          containerClassName={styles["form-section-input"]}
        />
        <CustomButton onClick={handleSubmit(onSubmit)}>SUBMIT</CustomButton>
      </div>
    </section>
  );
};
