import AttributeIcon from "../assets/platform_icons/attribute.svg";
import LabelsIcon from "../assets/platform_icons/labels.svg";
import GroupIcon from "../assets/platform_icons/group.svg";
import fitWidthIcon from "../assets/platform_icons/fit_width.svg";
import FeedbackIcon from "../assets/platform_icons/feedback.svg";
import ReportIcon from "../assets/platform_icons/report.svg";

export interface TabsProps {
  title: string;
  shortcut: string;
  id: number;
}

export const TabsData = [
  {
    title: "Attribute",
    shortcut: "e",
    id: 1,
    iconUrl: AttributeIcon,
    disabledWithoutCategory: true,
  },
  {
    title: "Labels",
    shortcut: "t",
    id: 2,
    iconUrl: LabelsIcon,
    disabledWithoutCategory: false,
  },
  {
    title: "Group",
    shortcut: "g",
    id: 3,
    iconUrl: GroupIcon,
    disabledWithoutCategory: true,
  },
  {
    title: "Fit Width",
    shortcut: "space",
    id: 4,
    iconUrl: fitWidthIcon,
    disabledWithoutCategory: true,
  },
  {
    title: "Feedback",
    shortcut: "f",
    id: 5,
    iconUrl: FeedbackIcon,
    disabledWithoutCategory: true,
  },
  {
    title: "Report",
    shortcut: "t",
    id: 6,
    iconUrl: ReportIcon,
    disabledWithoutCategory: false,
  },
];

export const DUMMY_CATEGORIES = [
  {
    id: "1",
    name: "TOPS",
    classes: [
      {
        title: "class",
        option: ["shirt", "blouse"],
      },
      {
        title: "subclass",
        option: ["formal", "denim"],
      },
    ],
  },
  {
    id: "2",
    name: "Bottoms",
    classes: [
      {
        title: "class",
        option: ["shirt", "blouse"],
      },
      {
        title: "subclass",
        option: ["formal", "denim"],
      },
    ],
  },
  {
    id: "3",
    name: "Dresses/Jumpsuits",
    classes: [
      {
        title: "class",
        option: ["shirt", "blouse"],
      },
      {
        title: "subclass",
        option: ["formal", "denim"],
      },
    ],
  },
  {
    id: "4",
    name: "Outerwear",
    classes: [
      {
        title: "class",
        option: ["shirt", "blouse"],
      },
      {
        title: "subclass",
        option: ["formal", "denim"],
      },
    ],
  },
];
