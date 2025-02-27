import type { ProjectI } from "src/types/project";
import { images } from "./projects-images";
export const projectsData: ProjectI[] = [
  {
    title: "Pizpiretos",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed rhoncus quam. Sed ex felis, blandit nec mollis eget, imperdiet at orci. Ut a volutpat tellus. Maecenas ex augue, pretium et porta sed, ullamcorper porta sem. Phasellus eget turpis at arcu porttitor molestie ut sed risus. Aliquam erat volutpat. Quisque convallis mattis orci ac porttitor. Aliquam blandit lectus ligula, consectetur elementum tortor interdum quis. Suspendisse potenti. Nullam ac ante non nisl egestas vehicula. Nulla id facilisis enim, auctor vulputate turpis. Sed rutrum eu massa vel feugiat. Fusce eu quam ipsum. Sed pulvinar aliquet tellus a lacinia. Vivamus at egestas eros.",
    image: images.pizpiretos,
    hyperlinks: [
      {
        label: "Live Demo",
        url: "https://expo.dev/accounts/hmmatus/projects/pizpiretos-app/builds/4d573fa6-4571-477a-8638-6f8c282a57c9",
        // icon: images.liveDemo,
      },
      {
        label: "Github",
        url: "https://github.com/hmmatus/pizpiretos-app",
        // icon: images.githubIcon,
      },
    ],
    projectInformation: [
      {
        label: "Year",
        value: "2024",
      },
      {
        label: "Role",
        value: "Frontend Developer",
      },
    ],
    tags: ["React", "Redux", "Node", "Express", "MongoDB"],
  },
  {
    title: "Banking App",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed rhoncus quam. Sed ex felis, blandit nec mollis eget, imperdiet at orci. Ut a volutpat tellus. Maecenas ex augue, pretium et porta sed, ullamcorper porta sem. Phasellus eget turpis at arcu porttitor molestie ut sed risus. Aliquam erat volutpat. Quisque convallis mattis orci ac porttitor. Aliquam blandit lectus ligula, consectetur elementum tortor interdum quis. Suspendisse potenti. Nullam ac ante non nisl egestas vehicula. Nulla id facilisis enim, auctor vulputate turpis. Sed rutrum eu massa vel feugiat. Fusce eu quam ipsum. Sed pulvinar aliquet tellus a lacinia. Vivamus at egestas eros.",
    image: images.bankingApp,
    hyperlinks: [],
    projectInformation: [],
    tags: ["React", "Redux", "Node", "Express", "MongoDB"],
  },
];
