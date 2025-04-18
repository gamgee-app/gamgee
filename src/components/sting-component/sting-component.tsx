import { useEffect, useState } from "react";
import styles from "./sting-component.module.css";
import { StingSword } from "../sting-sword/sting-sword";
import { EditionChapter, EditionDifferenceData } from "../../movies/movies.ts";
import dayjsUtc from "../../utils/dayjs-config.ts";

interface StingComponentProps {
  differences: EditionDifferenceData[];
  chapters: EditionChapter[];
  timestamp: number;
}

export const StingComponent = ({
  differences,
  chapters,
  timestamp,
}: StingComponentProps) => {
  const [swordIsGlowing, setSwordIsGlowing] = useState<boolean>(false);

  const getDifference = (time: number) =>
    differences.find(
      (difference) =>
        difference.start_time_ms < time && difference.end_time_ms > time,
    );

  useEffect(() => {
    const maybeDifference = getDifference(timestamp);
    if (maybeDifference && !swordIsGlowing) {
      setSwordIsGlowing(true);
    } else if (!maybeDifference && swordIsGlowing) {
      setSwordIsGlowing(false);
    }
  }, [timestamp]);

  const chapter = chapters.findLast((c) => c.start_time_ms <= timestamp);
  const chapterInfo = chapter?.title ?? "Unknown Chapter";

  return (
    <div className={styles.stingAppContainer}>
      <div className={styles.chapterSelection}>
        {chapterInfo && <span>{chapterInfo}</span>}
      </div>
      <StingSword swordIsGlowing={swordIsGlowing} />
      <div>
        <span>{dayjsUtc(timestamp).format("HH:mm:ss")}</span>
      </div>
    </div>
  );
};
