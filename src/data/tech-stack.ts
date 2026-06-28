export interface TechStackItemI {
  label: string;
  slug: string;
  icon: string;
}

export const techStackItems: TechStackItemI[] = [
  { label: "JavaScript", slug: "js", icon: "js" },
  { label: "TypeScript", slug: "typescript", icon: "typescript" },
  { label: "Next.js", slug: "nextjs", icon: "nextjs" },
  { label: "React Native", slug: "reactnative", icon: "reactnative" },
  { label: "NestJS", slug: "nestjs", icon: "nestjs" },
  { label: "Express", slug: "expressjs", icon: "expressjs" },
  { label: "PostgreSQL", slug: "postgresql", icon: "postgresql" },
  { label: "Prisma", slug: "prisma", icon: "prisma" },
  { label: "Firebase", slug: "firebase", icon: "firebase" },
  { label: "Docker", slug: "docker", icon: "docker" },
  { label: "Azure", slug: "azure", icon: "azure" },
  { label: "Figma", slug: "figma", icon: "figma" },
  { label: "Tailwind CSS", slug: "tailwindcss", icon: "tailwindcss" },
  { label: "Vercel", slug: "vercel", icon: "vercel" },
];
