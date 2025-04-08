import { useTimer } from "react-use-precision-timer";
import { useCallback, useState } from "react";

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

  const resetTimer = () => {
    if (timer.isRunning()) {
      timer.start();
    } else {
      timer.stop();
    }
  };

  return { timer, timestamp, toggleTimerState, resetTimer };
};
