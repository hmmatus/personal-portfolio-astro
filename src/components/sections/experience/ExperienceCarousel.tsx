import type { ExperienceI } from "@types/experience";
import type { ui } from "../../../i18n/ui";
import { useTranslations } from "../../../i18n/utils";
import { Carousel } from "@components/carousel";
import { ExperienceCard } from "@components/cards/experience";
import styles from "./ExperienceCarousel.module.scss";
import { EXPERIENCE_CAROUSEL_I18N_KEYS } from "./ExperienceCarousel.const";

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
    t(EXPERIENCE_CAROUSEL_I18N_KEYS.CAROUSEL_SLIDE_OF)
      .replace("{current}", String(current))
      .replace("{total}", String(total));

  const items = experienceList.map((item) => (
    <ExperienceCard key={`${item.company}-${item.startDate}`} item={item} />
  ));

  return (
    <div className={styles.wrapper}>
      <Carousel
        items={items}
        ariaLabel={t(EXPERIENCE_CAROUSEL_I18N_KEYS.TITLE)}
        prevLabel={t(EXPERIENCE_CAROUSEL_I18N_KEYS.CAROUSEL_PREV)}
        nextLabel={t(EXPERIENCE_CAROUSEL_I18N_KEYS.CAROUSEL_NEXT)}
        slideLabel={slideLabel}
      />
    </div>
  );
}
