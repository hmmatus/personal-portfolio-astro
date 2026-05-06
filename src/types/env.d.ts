interface ImportMetaEnv {
  readonly RESEND_TOKEN: string;
  readonly RESEND_FROM_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
