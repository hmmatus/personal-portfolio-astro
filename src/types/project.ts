export interface ProjectI {
  title: string;
  description: string;
  image: ImageMetadata;
  hiperlinks: HiperLink[];
  projectInformation: ProjectInformation[];
  tags: string[];
}

export interface HiperLink {
  label: string;
  url: string;
  icon: string;
}

export interface ProjectInformation {
  label: string;
  value: string;
}
