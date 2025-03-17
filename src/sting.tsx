import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from './sting.module.css'
import differencesList from './res/two_towers_extended_differences.json' with {type: "json"};
import { useStopwatch } from "react-timer-hook";
import classNames from "classnames";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from "dayjs";

export const StingComponent: FC = () => {
    const [backgroundActivated, setBackgroundActivated] = useState<boolean>(false);
    const [seekTimerInput, setSeekTimerInput] = useState<Dayjs | null>();

    let {totalSeconds, hours, minutes, seconds, pause, start, reset, isRunning} = useStopwatch({autoStart: true});

      const differencesDictionary = useMemo(() => {
        const differencesDict = new Map();
        differencesList.forEach(item => {
          const trimmedTimestamp = item.start_time.substring(0, 7);
          differencesDict.set(trimmedTimestamp, item);
        });
        return differencesDict;
      }, []);

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
        const key = hours + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0')
        if (differencesDictionary.has(key)) {
          toggleSting();
        }
      }, [hours, minutes, seconds, differencesDictionary]);

      const resetTimer = useCallback(() => {
        reset(undefined, isRunning);
      }, [isRunning, totalSeconds, reset]);

      const seekTimer = useCallback(() => {
        if (seekTimerInput == undefined){
          return;
        }
        totalSeconds = seekTimerInput.second() + (seekTimerInput.minute()*60) + (seekTimerInput.hour()*60*60);

        const timeToSeekTo = new Date(Date.now() + totalSeconds * 1000);
        reset(timeToSeekTo, isRunning)
      }, [isRunning, seekTimerInput])

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
      <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField onChange={(newValue) => setSeekTimerInput(newValue)} format="HH:mm:ss"/>
      </LocalizationProvider>
        <button onClick={() => {seekTimer()}}>Seek</button>
      </div>
    </div>)
}