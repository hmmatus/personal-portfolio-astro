import type { ProjectI } from "../types/project";
import type { ExperienceI } from "../types/experience";
import { useTranslations } from "../i18n/utils";
import type { ui, defaultLang } from "../i18n/ui";

// Type alias for translation keys
type TranslationKey = keyof (typeof ui)[typeof defaultLang];

export const heroData = {
  projectsList: [
    {
      id: "pizpiretos",
      image: "/images/projects/pizpiretos.webp",
      hyperlinks: [
        {
          labelKey: "projects.live-demo",
          url: "https://expo.dev/accounts/hmmatus/projects/pizpiretos-app/builds",
        },
      ],
      projectInformation: [
        {
          labelKey: "projects.year",
          value: "2024",
        },
        {
          labelKey: "projects.role",
          valueKey: "projects.full-stack-developer",
        },
      ],
      tags: [
        "React Native",
        "React Native Paper",
        "NestJS",
        "Sockets",
        "Firebase",
      ],
    },
    {
      id: "bankingapp",
      image: "/images/projects/bankingapp.webp",
      hyperlinks: [
        {
          labelKey: "projects.github",
          url: "https://github.com/hmmatus/BankingApp",
        },
      ],
      projectInformation: [
        {
          labelKey: "projects.year",
          value: "2024",
        },
      ],
      tags: ["React Native", "React Native Paper", "Firebase"],
    },
  ],
  capabilities: {
    capabilitiesList: [
      "Javascript",
      "Typescript",
      "React",
      "NextJs",
      "React Native",
      "Nestjs",
      "Express",
      "SQL",
      "MongoDB",
      "Prisma",
      "Figma",
      "Azure",
      "Docker",
    ],
  },
  experience: {
    experienceList: [
      {
        id: "coderland",
        startDate: "06/2024",
        endDate: "01/2025",
      },
      {
        id: "koibanx",
        startDate: "05/2021",
        endDate: "10/2023",
      },
      {
        id: "applaudo",
        startDate: "09/2020",
        endDate: "04/2021",
      },
      {
        id: "vincu",
        startDate: "05/2019",
        endDate: "09/2020",
      },
    ],
  },
};

// Utility functions to convert i18n data to component-expected types
export function getProjectsWithTranslations<L extends keyof typeof ui>(
  lang: L
): ProjectI[] {
  const t = useTranslations(lang);

  return heroData.projectsList.map((project) => ({
    title: t(`projects.${project.id}.title` as TranslationKey),
    description: t(`projects.${project.id}.description` as TranslationKey),
    image: project.image,
    tags: project.tags,
    hyperlinks: project.hyperlinks.map((link) => ({
      label: t(link.labelKey as TranslationKey),
      url: link.url,
    })),
    projectInformation: project.projectInformation.map((info) => ({
      label: t(info.labelKey as TranslationKey),
      value: info.valueKey
        ? t(info.valueKey as TranslationKey)
        : info.value || "",
    })),
  }));
}

export function getExperienceWithTranslations<L extends keyof typeof ui>(
  lang: L
): ExperienceI[] {
  const t = useTranslations(lang);

  return heroData.experience.experienceList.map((exp) => ({
    title: t(`experience.${exp.id}.title` as TranslationKey),
    company: t(`experience.${exp.id}.company` as TranslationKey),
    description: t(`experience.${exp.id}.description` as TranslationKey),
    startDate: exp.startDate,
    endDate: exp.endDate,
  }));
}
