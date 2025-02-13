// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
import icon from "astro-icon"
// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), icon()],
  experimental: {
    svg: true,
  }
});
