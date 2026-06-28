import azureIcon from "@assets/svg/azure.svg?url";
import dockerIcon from "@assets/svg/docker.svg?url";
import expressIcon from "@assets/svg/expressjs.svg?url";
import figmaIcon from "@assets/svg/figma.svg?url";
import firebaseIcon from "@assets/svg/firebase.svg?url";
import jsIcon from "@assets/svg/js.svg?url";
import nestJsIcon from "@assets/svg/nestjs.svg?url";
import nextJsIcon from "@assets/svg/nextjs.svg?url";
import postgreSqlIcon from "@assets/svg/postgresql.svg?url";
import prismaIcon from "@assets/svg/prisma.svg?url";
import reactNativeIcon from "@assets/svg/reactnative.svg?url";
import tailwindCssIcon from "@assets/svg/tailwindcss.svg?url";
import typeScriptIcon from "@assets/svg/typescript.svg?url";
import vercelIcon from "@assets/svg/vercel.svg?url";

export const techStackIconMap: Record<string, string> = {
  js: jsIcon,
  typescript: typeScriptIcon,
  nextjs: nextJsIcon,
  reactnative: reactNativeIcon,
  nestjs: nestJsIcon,
  expressjs: expressIcon,
  postgresql: postgreSqlIcon,
  prisma: prismaIcon,
  firebase: firebaseIcon,
  docker: dockerIcon,
  azure: azureIcon,
  figma: figmaIcon,
  tailwindcss: tailwindCssIcon,
  vercel: vercelIcon,
};
