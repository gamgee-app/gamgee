import { FC, useCallback, useEffect, useState } from "react";
import styles from "./sting-component.module.css";
import { StingSword } from "../sting-sword/sting-sword";
import { TextField } from "@mui/material";
import { usePlex } from "../../hooks/plex/usePlex.ts";
import { movies } from "../../movies/movies.ts";
import { Timer, useTimer } from "react-use-precision-timer";

export const StingComponent: FC = () => {
  const [swordIsGlowing, setSwordIsGlowing] = useState<boolean>(false);

  const timer: Timer = useTimer(
    { delay: 1000 / 24, startImmediately: true },
    () => setElapsedTime(timer.getElapsedRunningTime()),
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const movieEdition = movies["tt0167261"].editions.find(
    (edition) => edition.label === "Extended Edition",
  )!;

  const chaptersList = movieEdition.chapters!;
  const differencesList = movieEdition.differences!;

  const getDifference = useCallback(
    (time: number) =>
      differencesList.find(
        (difference) =>
          difference.start_time_ms < time && difference.end_time_ms > time,
      ),
    [differencesList],
  );

  useEffect(() => {
    const maybeDifference = getDifference(elapsedTime);
    if (maybeDifference && !swordIsGlowing) {
      setSwordIsGlowing(true);
    } else if (!maybeDifference && swordIsGlowing) {
      setSwordIsGlowing(false);
    }
  }, [elapsedTime, getDifference, swordIsGlowing]);

  const nextChapterIndex = chaptersList.findIndex(
    (c) => c.start_time_ms > elapsedTime,
  );

  const chapter = chaptersList[nextChapterIndex - 1];
  const chapterInfo = chapter.title;

  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const seconds = Math.floor(elapsedTime / 1000) % 60;

  const [plexIp, setPlexIp] = useState("");
  const [plexToken, setPlexToken] = useState("");
  usePlex(plexIp, plexToken);

  // Use imdbId to identify the movie playing, see movies.ts
  // Use playerState to automatically pause/play our stopwatch
  // Use estimatedPlayTime to keep our stopwatch in sync.

  return (
    <div className={styles.stingAppContainer}>
      <div className={styles.chapterSelection}>
        {chapterInfo && <span>{chapterInfo}</span>}
      </div>
      <StingSword swordIsGlowing={swordIsGlowing} />
      <div>
        <span>
          {hours}:{minutes}.{seconds}
        </span>
      </div>
      <TextField
        label="Plex IP"
        onChange={(newIpEvent) => setPlexIp(newIpEvent.target.value)}
      />
      <TextField
        label="Plex Token"
        onChange={(newTokenEvent) => setPlexToken(newTokenEvent.target.value)}
      />
    </div>
  );
};
