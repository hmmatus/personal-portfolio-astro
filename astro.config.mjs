// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
import node from "@astrojs/node";

let adapter = vercel();

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
  adapter = node({ mode: "standalone" });
}
export default defineConfig({
  output: 'server',
  adapter,
  integrations: [react()],
  experimental: {
    svg: true,
  },
    vite: {
    plugins: [
      svgr({
        include: '**/*.svg?react',
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: ['preset-default', 'removeTitle', 'removeDesc', 'removeDoctype', 'cleanupIds'],
          },
        },
      }),
      tailwindcss(),
    ],
  },
});
