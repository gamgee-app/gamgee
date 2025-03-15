import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from './sting.module.css'
import { useStopwatch } from "react-timer-hook";
import classNames from "classnames";

const times = [5, 15, 30, 35];

export const StingComponent: FC = () => {
    const [timeIndex, setTimeIndex] = useState<number>(0);
    const [backgroundActivated, setBackgroundActivated] = useState<boolean>(false);
    let {totalSeconds, hours, minutes, seconds, pause, start, reset, isRunning} = useStopwatch({autoStart: true});

      const toggleSting = useCallback(() => {
        if (!backgroundActivated) {
          setBackgroundActivated(true);
          return;
        }
        setBackgroundActivated(false);
      }, [backgroundActivated, setBackgroundActivated]);

      const toggleTimeRunningState = useCallback(() => {
        if (isRunning) {
          pause();
          return;
        }
        start();
      }, [pause, start, isRunning])

      useEffect(() => {
        if (totalSeconds === times[timeIndex]) {
          toggleSting();
          setTimeIndex((oldVal) => oldVal + 1);
        }
      }, [totalSeconds, setTimeIndex, timeIndex]);

      const resetTimer = useCallback(() => {
        reset(undefined, isRunning);
      }, [isRunning, totalSeconds, reset]);

    return (
    <div className={styles.stingAppContainer}>
      <div className={styles.stingContainer}>
        <div className={styles.stingSword}></div>
        <div className={backgroundActivated ? classNames(styles.stingGlow, styles.stingGlowUp) : classNames(styles.stingGlow, styles.stingGlowDown)}></div>  
      </div>
      <div>
        <span>{hours}:{minutes}.{seconds}</span>
      </div>
      <div>
        <button onClick={() => toggleSting()}>Test</button>
        <button onClick={() => {toggleTimeRunningState()}}>{isRunning ? "Pause" : "Play"}</button>
        <button onClick={() => {resetTimer()}}>Reset</button>
      </div>
    </div>)
}