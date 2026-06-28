import type { ExperienceI } from "@types/experience";
import type { ui } from "../../../i18n/ui";
import { useTranslations } from "../../../i18n/utils";
import { Carousel } from "@components/carousel";
import { ExperienceCard } from "@components/cards/experience";
import styles from "./ExperienceCarousel.module.scss";

export interface ExperienceCarouselPropsI {
  experienceList: ExperienceI[];
  lang: keyof typeof ui;
}

export function ExperienceCarousel({
  experienceList,
  lang,
}: ExperienceCarouselPropsI) {
  const t = useTranslations(lang);

  const slideLabel = (current: number, total: number) =>
    t("carousel.slideOf")
      .replace("{current}", String(current))
      .replace("{total}", String(total));

  const items = experienceList.map((item) => (
    <ExperienceCard key={`${item.company}-${item.startDate}`} item={item} />
  ));

  return (
    <div className={styles.wrapper}>
      <Carousel
        items={items}
        ariaLabel={t("experience.title")}
        prevLabel={t("carousel.prev")}
        nextLabel={t("carousel.next")}
        slideLabel={slideLabel}
      />
    </div>
  );
}
