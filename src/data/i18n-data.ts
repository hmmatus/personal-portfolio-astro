import { getCollection } from "astro:content";
import type { ProjectI } from "../types/project";
import type { ExperienceI } from "../types/experience";
import { useTranslations } from "../i18n/utils";
import type { ui, defaultLang } from "../i18n/ui";

// Type alias for translation keys
type TranslationKey = keyof (typeof ui)[typeof defaultLang];

const LINK_LABEL_KEYS: Record<string, TranslationKey> = {
  "live-demo": "projects.live-demo" as TranslationKey,
  github: "projects.github" as TranslationKey,
};

function formatExperienceDate(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${month}/${year}`;
}

// Utility functions to convert content-collection entries to component-expected types
export async function getProjectsWithTranslations<L extends keyof typeof ui>(
  lang: L
): Promise<ProjectI[]> {
  const t = useTranslations(lang);
  const projects = await getCollection("projects");

  return projects
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ data: project }) => ({
    title: project.title[lang],
    description: project.description[lang],
    image: project.image,
    tags: project.tags,
    hyperlinks: (project.links ?? []).map((link) => ({
      label: t(LINK_LABEL_KEYS[link.type]),
      url: link.url,
    })),
    projectInformation: [
      { label: t("projects.year" as TranslationKey), value: project.year },
      ...(project.role
        ? [
            {
              label: t("projects.role" as TranslationKey),
              value: project.role[lang],
            },
          ]
        : []),
    ],
  }));
}

export async function getExperienceWithTranslations<L extends keyof typeof ui>(
  lang: L
): Promise<ExperienceI[]> {
  const experience = await getCollection("experience");

  return experience
    .sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .map(({ data: exp }) => ({
      title: exp.title[lang],
      company: exp.company[lang],
      description: exp.description[lang],
      startDate: formatExperienceDate(exp.startDate),
      endDate: exp.isCurrent
        ? useTranslations(lang)("experience.present" as TranslationKey)
        : formatExperienceDate(exp.endDate as Date),
    }));
}
