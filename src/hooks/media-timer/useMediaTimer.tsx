import { useTimer } from "react-use-precision-timer";
import { useCallback, useState } from "react";
import dayjsUtc from "../../utils/dayjs-config.ts";

export interface MediaTimerProperties {
  timestamp: number;
  toggleLabel: string;
}

export interface MediaTimerActions {
  toggle: () => void;
  reset: () => void;
  seek: (milliseconds: number) => void;
}

interface UseMediaTimerProps {
  mediaTimerProperties: MediaTimerProperties;
  mediaTimerActions: MediaTimerActions;
}

export const useMediaTimer = (): UseMediaTimerProps => {
  const [timestamp, setTimestamp] = useState<number>(0);

  const updateElapsedTime = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setTimestamp(elapsed);
  }, []);

  const timer = useTimer({ delay: 1000 / 24 }, updateElapsedTime);

  const toggle = () => {
    if (!timer.isStarted()) {
      timer.start();
    } else if (timer.isRunning()) {
      timer.pause();
    } else {
      timer.resume();
    }
  };

  const toggleLabel = !timer.isStarted()
    ? "Start"
    : timer.isRunning()
      ? "Pause"
      : "Resume";

  const reset = () => {
    if (timer.isRunning()) {
      timer.start();
    } else {
      timer.stop();
    }
  };

  const seek = (milliseconds: number) => {
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
    mediaTimerProperties: {
      timestamp,
      toggleLabel,
    },
    mediaTimerActions: {
      toggle,
      reset,
      seek,
    },
  };
};
