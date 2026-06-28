import type { ProjectI } from "@types/project";
import { ImageWithLoader } from "@components/image-loader/ImageLoader";
import { HyperLinkLabel } from "@components/sections/projects/components/hyperLinkLabel/HyperLinkLabel";
import { truncateWords } from "@utils/truncateWords";
import { ProjectInfoRow } from "./ProjectInfoRow";
import styles from "./ProjectCard.module.scss";

export interface ProjectCardPropsI {
  project: ProjectI;
}

function ProjectTag({ label }: { label: string }) {
  return (
    <span className={styles.chip}>
      {label}
    </span>
  );
}

export function ProjectCard({ project }: ProjectCardPropsI) {
  const { title, image, description, tags, projectInformation, hyperlinks } =
    project;
  const { displayText, isTruncated } = truncateWords(description);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ImageWithLoader
          className={styles.image}
          src={image}
          alt={`${title} project screenshot`}
        />
        {tags.length > 0 && (
          <div className={styles.chips}>
            {tags.map((tag) => (
              <ProjectTag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p
          className={styles.description}
          title={isTruncated ? description : undefined}
        >
          {displayText}
        </p>

        {projectInformation.length > 0 && (
          <div className={styles.specs}>
            <ProjectInfoRow title="PROJECT INFO" description="" />
            {projectInformation.map((info) => (
              <ProjectInfoRow
                key={`${info.label}-${info.value}`}
                title={info.label}
                description={info.value}
              />
            ))}
          </div>
        )}

        {hyperlinks.length > 0 && (
          <div className={styles.actions}>
            {hyperlinks.map(({ label, url, icon }) => (
              <HyperLinkLabel
                key={`${label}-${url}`}
                icon={icon}
                label={label}
                url={url}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
