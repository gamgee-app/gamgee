import differencesFellowshipExtended from "./tt0120737/extended/differences.json" with { type: "json" };
import chaptersFellowshipExtended from "./tt0120737/extended/chapters.json" with { type: "json" };
import differencesFellowshipTheatrical from "./tt0120737/theatrical/differences.json" with { type: "json" };
import chaptersFellowshipTheatrical from "./tt0120737/theatrical/chapters.json" with { type: "json" };
import differencesTheTwoTowersExtended from "./tt0167261/extended/differences.json" with { type: "json" };
import chaptersTheTwoTowersExtended from "./tt0167261/extended/chapters.json" with { type: "json" };
import differencesTheTwoTowersTheatrical from "./tt0167261/theatrical/differences.json" with { type: "json" };
import chaptersTheTwoTowersTheatrical from "./tt0167261/theatrical/chapters.json" with { type: "json" };
import differencesReturnOfTheKingExtended from "./tt0167260/extended/differences.json" with { type: "json" };
import chaptersReturnOfTheKingExtended from "./tt0167260/extended/chapters.json" with { type: "json" };
import differencesReturnOfTheKingTheatrical from "./tt0167260/theatrical/differences.json" with { type: "json" };
import chaptersReturnOfTheKingTheatrical from "./tt0167260/theatrical/chapters.json" with { type: "json" };

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
  chapters: EditionChapter[];
  differences: EditionDifferenceData[];
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
        chapters: chaptersFellowshipTheatrical,
        differences: differencesFellowshipTheatrical,
      },
      {
        label: "Extended Edition",
        duration: 13691758,
        chapters: chaptersFellowshipExtended,
        differences: differencesFellowshipExtended,
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
        chapters: chaptersTheTwoTowersTheatrical,
        differences: differencesTheTwoTowersTheatrical,
      },
      {
        label: "Extended Edition",
        duration: 14125166,
        chapters: chaptersTheTwoTowersExtended,
        differences: differencesTheTwoTowersExtended,
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
        chapters: chaptersReturnOfTheKingTheatrical,
        differences: differencesReturnOfTheKingTheatrical,
      },
      {
        label: "Extended Edition",
        duration: 15790797,
        chapters: chaptersReturnOfTheKingExtended,
        differences: differencesReturnOfTheKingExtended,
      },
    ],
  },
] as const satisfies Movie[];

export type ImdbId = (typeof movies)[number]["imdbId"];
export const imdbIds = movies.map((movie) => movie.imdbId);
