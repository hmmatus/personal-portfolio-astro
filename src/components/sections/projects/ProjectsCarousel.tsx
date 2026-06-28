import type { ProjectI } from "@types/project";
import type { ui } from "../../../i18n/ui";
import { useTranslations } from "../../../i18n/utils";
import { Carousel } from "@components/carousel";
import { ProjectCard } from "@components/cards/project";
import styles from "./ProjectsCarousel.module.scss";

export interface ProjectsCarouselPropsI {
  projectsList: ProjectI[];
  lang: keyof typeof ui;
}

export function ProjectsCarousel({
  projectsList,
  lang,
}: ProjectsCarouselPropsI) {
  const t = useTranslations(lang);

  const slideLabel = (current: number, total: number) =>
    t("carousel.slideOf")
      .replace("{current}", String(current))
      .replace("{total}", String(total));

  const items = projectsList.map((project) => (
    <ProjectCard key={project.title} project={project} />
  ));

  return (
    <div className={styles.wrapper}>
      <Carousel
        items={items}
        ariaLabel={t("projects.title")}
        prevLabel={t("carousel.prev")}
        nextLabel={t("carousel.next")}
        slideLabel={slideLabel}
      />
    </div>
  );
}
