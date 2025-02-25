import type { ProjectI } from "src/types/project";
import { images } from "./projects-images";
export const projectsData: ProjectI[] = [
  {
    title: "Pizpiretos",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed rhoncus quam. Sed ex felis, blandit nec mollis eget, imperdiet at orci. Ut a volutpat tellus. Maecenas ex augue, pretium et porta sed, ullamcorper porta sem. Phasellus eget turpis at arcu porttitor molestie ut sed risus. Aliquam erat volutpat. Quisque convallis mattis orci ac porttitor. Aliquam blandit lectus ligula, consectetur elementum tortor interdum quis. Suspendisse potenti. Nullam ac ante non nisl egestas vehicula. Nulla id facilisis enim, auctor vulputate turpis. Sed rutrum eu massa vel feugiat. Fusce eu quam ipsum. Sed pulvinar aliquet tellus a lacinia. Vivamus at egestas eros.",
    image: images.pizpiretos,
    hiperlinks: [],
    projectInformation: [],
    tags: ["React", "Redux", "Node", "Express", "MongoDB"],
  },
  {
    title: "Banking App",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed rhoncus quam. Sed ex felis, blandit nec mollis eget, imperdiet at orci. Ut a volutpat tellus. Maecenas ex augue, pretium et porta sed, ullamcorper porta sem. Phasellus eget turpis at arcu porttitor molestie ut sed risus. Aliquam erat volutpat. Quisque convallis mattis orci ac porttitor. Aliquam blandit lectus ligula, consectetur elementum tortor interdum quis. Suspendisse potenti. Nullam ac ante non nisl egestas vehicula. Nulla id facilisis enim, auctor vulputate turpis. Sed rutrum eu massa vel feugiat. Fusce eu quam ipsum. Sed pulvinar aliquet tellus a lacinia. Vivamus at egestas eros.",
    image: images.bankingApp,
    hiperlinks: [],
    projectInformation: [],
    tags: ["React", "Redux", "Node", "Express", "MongoDB"],
  },
];
