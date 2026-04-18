import styles from "./sting-component.module.css";
import { StingSword } from "../sting-sword/sting-sword";

interface StingComponentProps {
  swordOn: boolean;
  chapterTitle: string | null;
  timestampMs: number;
}

const formatTimestamp = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
};

export const StingComponent = ({
  swordOn,
  chapterTitle,
  timestampMs,
}: StingComponentProps) => {
  return (
    <div className={styles.stingAppContainer}>
      <div className={styles.chapterSelection}>
        <span>{chapterTitle ?? "Unknown Chapter"}</span>
      </div>
      <StingSword swordIsGlowing={swordOn} />
      <div>
        <span>{formatTimestamp(timestampMs)}</span>
      </div>
    </div>
  );
};
