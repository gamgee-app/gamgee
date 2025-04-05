import { useCallback, useEffect, useState } from "react";
import styles from "./sting-component.module.css";
import { StingSword } from "../sting-sword/sting-sword";
import { Timer, useTimer } from "react-use-precision-timer";
import { EditionChapter, EditionDifferenceData } from "../../movies/movies.ts";

interface StingComponentProps {
  differences: EditionDifferenceData[];
  chapters: EditionChapter[];
}

export const StingComponent = ({
  differences,
  chapters,
}: StingComponentProps) => {
  const [swordIsGlowing, setSwordIsGlowing] = useState<boolean>(false);

  const updateElapsedTime = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setElapsedTime(elapsed);
  }, []);

  const timer: Timer = useTimer({ delay: 1000 / 24 }, updateElapsedTime);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const getDifference = (time: number) =>
    differences.find(
      (difference) =>
        difference.start_time_ms < time && difference.end_time_ms > time,
    );

  useEffect(() => {
    const maybeDifference = getDifference(elapsedTime);
    if (maybeDifference && !swordIsGlowing) {
      setSwordIsGlowing(true);
    } else if (!maybeDifference && swordIsGlowing) {
      setSwordIsGlowing(false);
    }
  }, [elapsedTime]);

  const nextChapterIndex = chapters.findIndex(
    (c) => c.start_time_ms > elapsedTime,
  );

  const chapter = chapters[nextChapterIndex - 1];
  const chapterInfo = chapter.title;

  useEffect(() => timer.start(), []);

  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const seconds = Math.floor(elapsedTime / 1000) % 60;

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
    </div>
  );
};
