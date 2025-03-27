import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./sting-component.module.css";
import differencesList from "../../res/two_towers_extended_differences_ms.json" with { type: "json" };
import chaptersList from "../../res/two_towers_extended_chapters_ms.json" with { type: "json" };
import { Dayjs } from "dayjs";
import { StingSword } from "../sting-sword/sting-sword";
import { TextField } from "@mui/material";
import { usePlex } from "../../hooks/plex/usePlex.ts";
import { useTimer, Timer } from "react-use-precision-timer";

export const StingComponent: FC = () => {
  const [swordIsGlowing, setSwordIsGlowing] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const getDifference = (time: number) =>
    differencesList.find((d) => d.start_time_ms < time && d.end_time_ms > time);

  const msStopwatchTest = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setElapsedTime(elapsed);
  }, []);

  const timer: Timer = useTimer({ delay: 1000 / 24 }, msStopwatchTest);

  useEffect(() => {
    console.log(elapsedTime);
    const maybeDifference = getDifference(elapsedTime);
    if (maybeDifference && !swordIsGlowing) {
      setSwordIsGlowing(true);
    } else if (!maybeDifference && swordIsGlowing) {
      setSwordIsGlowing(false);
    }
  }, [elapsedTime]);

  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const seconds = Math.floor(elapsedTime / 1000) % 60;

  useEffect(() => timer.start(), []);

  const nextChapterIndex = chaptersList.findIndex(
    (c) => c.start_time_ms > elapsedTime,
  );
  const chapter = chaptersList[nextChapterIndex - 1];
  const chapterInfo = chapter.title;

  const [plexIp, setPlexIp] = useState("");
  const [plexToken, setPlexToken] = useState("");
  const { imdbId, estimatedPlayTime, playerState, error } = usePlex(
    plexIp,
    plexToken,
  );

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
