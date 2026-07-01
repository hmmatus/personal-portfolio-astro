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
import { FORM_I18N_KEYS } from "./FormSection.const";

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
    mode: "onSubmit",
  });

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        showSuccessToast(t(FORM_I18N_KEYS.TOAST_SUCCESS));
        reset();
      } else {
        throw response.text();
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(t(FORM_I18N_KEYS.TOAST_NETWORK_ERROR), { duration: 5000 });
    }
  };

  return (
    <section id="form-section" className={styles["form-section"]} data-reveal>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            border: "1px solid #27272a",
            borderRadius: "3px",
            padding: "12px 16px",
            fontSize: "13px",
            fontFamily: "'DM Mono', monospace",
          },
        }}
      />
      <div className={styles["form-section-header"]}>
        <h2>{t(FORM_I18N_KEYS.TITLE)}</h2>
        <div className={styles["form-hyperlink-container"]}>
          <p>{t(FORM_I18N_KEYS.GREETING)} </p>
          <FormHyperlink label={EMAIL} href={`mailto:${EMAIL}`} />
        </div>
        <div className={styles["form-hyperlink-container"]}>
          <p>{t(FORM_I18N_KEYS.RESUME)} </p>
          <FormHyperlink label={t(FORM_I18N_KEYS.RESUME_LINK)} href={RESUME} />
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
          label={t(FORM_I18N_KEYS.NAME_LABEL)}
          autoComplete="name"
          {...register("name")}
          errorMessage={errors.name?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="email"
          label={t(FORM_I18N_KEYS.EMAIL_LABEL)}
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          {...register("email")}
          errorMessage={errors.email?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputText
          id="subject"
          label={t(FORM_I18N_KEYS.SUBJECT_LABEL)}
          autoComplete="off"
          {...register("subject")}
          errorMessage={errors.subject?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <InputTextField
          id="message"
          label={t(FORM_I18N_KEYS.MESSAGE_LABEL)}
          {...register("message")}
          errorMessage={errors.message?.message || ""}
          containerClassName={styles["form-section-input"]}
        />
        <CustomButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t(FORM_I18N_KEYS.SUBMITTING) : t(FORM_I18N_KEYS.SUBMIT)}
        </CustomButton>
      </form>
    </section>
  );
};
