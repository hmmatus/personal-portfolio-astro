import { useMemo } from "react";
import { EMAIL, RESUME } from "src/consts/social-media-links";
import { ConnectSection, FormHyperlink } from "./components";
import styles from "./FormSection.module.scss";
import { InputText, InputTextField } from "@components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@components/buttons";
import { Toaster } from "react-hot-toast";
import {
  createContactFormSchema,
  type ContactFormData,
} from "@schemas/contact-form";
import { showSuccessToast, showErrorToast } from "@utils/react/toast";
import { useTranslations } from "../../../i18n/utils";
import { ui } from "../../../i18n/ui";

interface FormSectionProps {
  currentLang?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  currentLang = "en",
}) => {
  const t = useTranslations(currentLang as keyof typeof ui);
  const contactFormSchema = createContactFormSchema(t);

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
        showSuccessToast(t("toast.form.success"));
        reset(); // Clear the form after successful submission
      } else {
        throw response.text();
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(t("toast.form.network.error"), {
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
        <h2>{t("form.title")}</h2>
        <div className={styles["form-hyperlink-container"]}>
          <p>{t("form.greeting")} </p>
          <FormHyperlink
            label={EMAIL}
            onClick={() => openLink(`mailto:${EMAIL}`)}
          />
        </div>
        <div className={styles["form-hyperlink-container"]}>
          <p>{t("form.resume")} </p>
          <FormHyperlink
            label={t("form.resume.link")}
            onClick={() => openLink(RESUME)}
          />
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
          label={t("form.name.label")}
          {...register("name")}
          errorMessage={errors.name?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="email"
          label={t("form.email.label")}
          {...register("email")}
          errorMessage={errors.email?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="subject"
          label={t("form.subject.label")}
          {...register("subject")}
          errorMessage={errors.subject?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputTextField
          id="message"
          label={t("form.message.label")}
          {...register("message")}
          errorMessage={errors.message?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <CustomButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </CustomButton>
      </form>
    </section>
  );
};
