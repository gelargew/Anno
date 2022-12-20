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
  },
  {
    title: "Labels",
    shortcut: "t",
    id: 2,
  },
  {
    title: "Group",
    shortcut: "g",
    id: 3,
  },
  {
    title: "Fit Width",
    shortcut: "space",
    id: 4,
  },
  {
    title: "Feedback",
    shortcut: "f",
    id: 5,
  },
  {
    title: "Report",
    shortcut: "t",
    id: 6,
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
