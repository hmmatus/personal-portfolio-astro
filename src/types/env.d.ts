interface ImportMetaEnv {
  readonly RESEND_TOKEN: string;
  readonly RESEND_FROM_EMAIL: string;
  readonly RESEND_TO_EMAIL: string;
  readonly RESEND_WEBHOOK_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    lang: 'en' | 'es';
  }
}
