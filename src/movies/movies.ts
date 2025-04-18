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
  imdbId: string;
  editions: MovieEdition[];
};

export const movies = [
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    imdbId: "tt0120737",
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
  {
    title: "The Lord of the Rings: The Two Towers",
    imdbId: "tt0167261",
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
  {
    title: "The Lord of the Rings: The Return of the King",
    imdbId: "tt0167260",
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
] as const satisfies Movie[];

export type ImdbId = (typeof movies)[number]["imdbId"];
export const imdbIds = movies.map((movie) => movie.imdbId);
