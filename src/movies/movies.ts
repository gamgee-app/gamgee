import differencesTheTwoTowers from "./tt0167261/extended/differences.json" with { type: "json" };
import chaptersTheTwoTowers from "./tt0167261/extended/chapters.json" with { type: "json" };

export const movies = {
  tt0120737: {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    editions: [
      {
        label: "Theatrical Edition",
        duration: 10705472,
      },
      {
        label: "Extended Edition",
        duration: 13691758,
      },
    ],
  },
  tt0167261: {
    title: "The Lord of the Rings: The Two Towers",
    editions: [
      {
        label: "Theatrical Edition",
        duration: 10765760,
      },
      {
        label: "Extended Edition",
        duration: 14125166,
        chapters: chaptersTheTwoTowers,
        differences: [
          { label: "Theatrical Edition", data: differencesTheTwoTowers },
        ],
      },
    ],
  },
  tt0167260: {
    title: "The Lord of the Rings: The Return of the King",
    editions: [
      {
        label: "Theatrical Edition",
        duration: 12061823,
      },
      {
        label: "Extended Edition",
        duration: 15790797,
      },
    ],
  },
};
