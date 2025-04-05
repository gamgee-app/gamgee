import differencesTheTwoTowers from "./tt0167261/extended/differences.json" with { type: "json" };
import chaptersTheTwoTowers from "./tt0167261/extended/chapters.json" with { type: "json" };

export type EditionDifferenceData = {
  start_time: string;
  start_time_ms: number;
  end_time: string;
  end_time_ms: number;
  type: string;
};

export type EditionChapter = {
  start_time: string;
  start_time_ms: number;
  title: string;
};

export type MovieEdition = {
  label: string;
  duration: number;
  chapters?: EditionChapter[]; // TODO make required field once we have all the data
  differences?: EditionDifferenceData[]; // TODO make required field once we have all the data
};

export type Movie = {
  title: string;
  editions: MovieEdition[];
};

export type Movies = { [key: string]: Movie };

export const movies: Movies = {
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
        differences: differencesTheTwoTowers,
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
