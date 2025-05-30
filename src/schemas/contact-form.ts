import { z } from "zod";
import { ui, defaultLang } from "../i18n/ui";

// Contact form validation schema generator that accepts translations
export const createContactFormSchema = (
  t: (key: keyof (typeof ui)[typeof defaultLang]) => string
) => {
  return z.object({
    name: z
      .string()
      .min(1, t("form.validation.name.required"))
      .min(2, t("form.validation.name.min"))
      .max(50, t("form.validation.name.max")),
    email: z
      .string()
      .min(1, t("form.validation.email.required"))
      .email(t("form.validation.email.invalid")),
    subject: z
      .string()
      .min(1, t("form.validation.subject.required"))
      .min(5, t("form.validation.subject.min"))
      .max(100, t("form.validation.subject.max")),
    message: z
      .string()
      .min(1, t("form.validation.message.required"))
      .min(10, t("form.validation.message.min"))
      .max(1000, t("form.validation.message.max")),
  });
};

// Static schema for backward compatibility (English by default)
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Type inference from schema
export type ContactFormData = z.infer<typeof contactFormSchema>;
