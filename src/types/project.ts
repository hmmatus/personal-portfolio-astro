export interface ProjectI {
  title: string;
  description: string;
  image: string;
  hyperlinks: HyperLink[];
  projectInformation: ProjectInformation[];
  tags: string[];
}

export interface HyperLink {
  label: string;
  url: string;
  icon?: string;
}

export interface ProjectInformation {
  label: string;
  value: string;
}
