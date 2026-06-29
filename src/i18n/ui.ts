import enTranslations from './en.json';
import esTranslations from './es.json';

export const languages = {
  en: "English",
  es: "Español",
};

export const defaultLang = "en";
export const showDefaultLang = false;

export const ui = {
  en: enTranslations,
  es: esTranslations,
} as const;
