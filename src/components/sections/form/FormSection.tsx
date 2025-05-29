import { EMAIL, RESUME } from "src/consts/social-media-links";
import { ConnectSection, FormHyperlink } from "./components";
import styles from "./FormSection.module.scss";
import { InputText, InputTextField } from "@components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@components/buttons";
import { Toaster } from "react-hot-toast";
import { contactFormSchema, type ContactFormData } from "@schemas/contact-form";
import { showSuccessToast, showErrorToast } from "@utils/react/toast";
import { TOAST_MESSAGES } from "@consts/toast-messages";

export const FormSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit", // Only validate on submit
  });

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      const options = {
        from: EMAIL,
        to: EMAIL,
        subject: `${data.email} - ${data.subject}`,
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
        showSuccessToast(TOAST_MESSAGES.FORM_SUCCESS);
        reset(); // Clear the form after successful submission
      } else {
        throw response.text();
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(TOAST_MESSAGES.FORM_NETWORK_ERROR, {
        duration: 5000, // Longer duration for network errors
      });
    }
  };

  return (
    <section id="form-section" className={styles["form-section"]}>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["form-section-body"]}
      >
        <InputText
          id="name"
          label={"Name"}
          {...register("name")}
          errorMessage={errors.name?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="email"
          label={"Email"}
          {...register("email")}
          errorMessage={errors.email?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="subject"
          label={"Subject"}
          {...register("subject")}
          errorMessage={errors.subject?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputTextField
          id="message"
          label={"Message"}
          {...register("message")}
          errorMessage={errors.message?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <CustomButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "SENDING..." : "SUBMIT"}
        </CustomButton>
      </form>
    </section>
  );
};
