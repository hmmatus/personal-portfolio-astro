import { defineMiddleware } from "astro:middleware";

const SUPPORTED_LANGS = ['en', 'es'] as const;

function parseLangFromHeader(header: string | null): 'en' | 'es' | null {
  if (!header) return null;
  const tags = header.split(',');
  for (const tag of tags) {
    const base = tag.split(';')[0].trim().split('-')[0].toLowerCase();
    if (SUPPORTED_LANGS.includes(base as 'en' | 'es')) {
      return base as 'en' | 'es';
    }
  }
  return null;
}

export const onRequest = defineMiddleware((context, next) => {
  const cookieHeader = context.request.headers.get('cookie') ?? '';
  const langCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('lang='))
    ?.split('=')?.[1]
    ?.trim();

  const fromCookie =
    langCookie && SUPPORTED_LANGS.includes(langCookie as 'en' | 'es')
      ? (langCookie as 'en' | 'es')
      : null;

  const fromHeader = parseLangFromHeader(
    context.request.headers.get('accept-language')
  );

  context.locals.lang = fromCookie ?? fromHeader ?? 'en';

  return next();
});
