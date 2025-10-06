import styles from "./sting-component.module.css";
import { StingSword } from "../sting-sword/sting-sword";
import { EditionChapter, EditionDifferenceData } from "../../movies/movies.ts";
import dayjsUtc from "../../utils/dayjs-config.ts";
import { useIsGlowing } from "./useIsGlowing.ts";
import { useCallWebhook } from "./useCallWebhook.ts";

interface StingComponentProps {
  differences: EditionDifferenceData[];
  chapters: EditionChapter[];
  timestamp: number;
  swordOnWebhookUrl: string;
  swordOffWebhookUrl: string;
}

export const StingComponent = ({
  differences,
  chapters,
  timestamp,
  swordOnWebhookUrl,
  swordOffWebhookUrl,
}: StingComponentProps) => {
  const swordIsGlowing = useIsGlowing(differences, timestamp);
  useCallWebhook(swordIsGlowing, swordOnWebhookUrl, swordOffWebhookUrl);

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
