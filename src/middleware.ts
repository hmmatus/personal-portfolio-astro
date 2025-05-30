import { defineMiddleware } from "astro:middleware";
import { defaultLang } from "./i18n/ui";
import { supportedLanguages } from "./i18n/utils";

export const onRequest = defineMiddleware((context, next) => {
  // Get the pathname from the request
  const pathname = context.url.pathname;

  // Check if the pathname starts with a language code
  const pathnameIsMissingLocale = supportedLanguages.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  // If the pathname doesn't start with a language code and it's not the root
  // redirect to the default language
  if (pathnameIsMissingLocale && pathname !== "/") {
    return context.redirect(`/${defaultLang}${pathname}`);
  }

  return next();
});
