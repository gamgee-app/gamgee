import { useTimer } from "react-use-precision-timer";
import { useCallback, useState } from "react";
import dayjsUtc from "../../utils/dayjs-config.ts";

export const useMediaTimer = () => {
  const [timestamp, setTimestamp] = useState<number>(0);

  const updateElapsedTime = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setTimestamp(elapsed);
  }, []);

  const timer = useTimer({ delay: 1000 / 24 }, updateElapsedTime);

  const toggleTimerState = () => {
    if (!timer.isStarted()) {
      timer.start();
    } else if (timer.isRunning()) {
      timer.pause();
    } else {
      timer.resume();
    }
  };

  const toggleTimerLabel = !timer.isStarted()
    ? "Start"
    : timer.isRunning()
      ? "Pause"
      : "Resume";

  const resetTimer = () => {
    if (timer.isRunning()) {
      timer.start();
    } else {
      timer.stop();
    }
  };

  const seekTimer = (milliseconds: number) => {
    const currentEpochMillis = dayjsUtc().valueOf();
    const startTime = currentEpochMillis - milliseconds;
    if (timer.isRunning()) {
      timer.start(startTime);
    } else {
      timer.start(startTime);
      timer.pause();
    }
  };

  return {
    timestamp,
    toggleTimerState,
    toggleTimerLabel,
    resetTimer,
    seekTimer,
  };
};
