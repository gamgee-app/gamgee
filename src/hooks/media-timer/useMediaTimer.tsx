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

export const useMediaTimer = (fps: number): UseMediaTimerProps => {
  const [timestamp, setTimestamp] = useState<number>(0);

  const updateElapsedTime = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setTimestamp(elapsed);
  }, []);

  const timer = useTimer({ delay: 1000 / fps }, updateElapsedTime);

  const pause = () => {
    // callback is not called in useTimer when timer is not running
    timer.pause();
    updateElapsedTime();
  };

  const stop = () => {
    // callback is not called in useTimer when timer is not running
    timer.stop();
    updateElapsedTime();
  };

  const toggle = () => {
    if (!timer.isStarted()) {
      timer.start();
    } else if (timer.isRunning()) {
      pause();
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
      stop();
    }
  };

  const seek = (milliseconds: number) => {
    const currentEpochMillis = dayjsUtc().valueOf();
    const startTime = currentEpochMillis - milliseconds;
    if (timer.isRunning()) {
      timer.start(startTime);
    } else {
      timer.start(startTime);
      pause();
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
