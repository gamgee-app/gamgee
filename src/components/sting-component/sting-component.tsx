import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from './sting.module.css'
import differencesList from '../../res/two_towers_extended_differences.json' with {type: "json"};
import chaptersList from '../../res/two_towers_extended_chapters.json' with {type: "json"};
import { useStopwatch } from "react-timer-hook";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from "dayjs";
import { StingSword } from "../sting-sword/sting-sword";

export const StingComponent: FC = () => {
    const [backgroundActivated, setBackgroundActivated] = useState<boolean>(false);
    const [seekTimerInput, setSeekTimerInput] = useState<Dayjs | null>();
    const [sceneEndTime, setSceneEndTime] = useState<string | undefined>(undefined);
    const [chapterInfo, setChapterInfo] = useState<string | undefined>(undefined)

    let {totalSeconds, hours, minutes, seconds, pause, start, reset, isRunning} = useStopwatch({autoStart: true});

      const differencesDictionary = useMemo(() => {
        const differencesDict = new Map<string, any>();
        differencesList.forEach(item => {
          const trimmedTimestamp = item.start_time.substring(0, 7);
          differencesDict.set(trimmedTimestamp, item);
        });
        return differencesDict;
      }, []);

      const chaptersByTimestamp = useMemo(() => {
        const chaptersByTimestampDictionary = new Map<string, string>();
        chaptersList.forEach(item => {
          const trimmedTimestamp = item.start_time.substring(1, 8);
          chaptersByTimestampDictionary.set(trimmedTimestamp, item.title);
        });
        return chaptersByTimestampDictionary;
      }, [])

      useEffect(() => {
        const key = hours + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0')
        if (differencesDictionary.has(key)) {
          toggleSting(true);
          setSceneEndTime(differencesDictionary.get(key).end_time.substring(0, 7));
        }
        if (key === sceneEndTime) {
          setSceneEndTime(undefined);
          toggleSting(false);
        }
        if (chaptersByTimestamp.has(key)) {
          setChapterInfo(chaptersByTimestamp.get(key))
        }
      }, [hours, minutes, seconds, differencesDictionary, chaptersByTimestamp, sceneEndTime]);

      const resetTimer = useCallback(() => {
        reset(undefined, isRunning);
        toggleSting(false);
      }, [isRunning, totalSeconds, reset]);

      const seekTimer = useCallback(() => {
        if (seekTimerInput == undefined){
          return;
        }
        totalSeconds = seekTimerInput.second() + (seekTimerInput.minute()*60) + (seekTimerInput.hour()*60*60);

        const timeToSeekTo = new Date(Date.now() + totalSeconds * 1000);
        reset(timeToSeekTo, isRunning)
      }, [isRunning, seekTimerInput])

      const toggleTimeRunningState = useCallback(() => {
        if (isRunning) {
          pause();
          return;
        }
        start();
      }, [pause, start, isRunning]);

      const toggleSting = useCallback((shouldActivate: boolean) => {
        setBackgroundActivated(shouldActivate);
      }, [backgroundActivated, setBackgroundActivated]);

    return (
    <div className={styles.stingAppContainer}>
      <div className={styles.chapterSelection}>{
          chapterInfo && (<span>{chapterInfo}</span>)}
      </div>
        <StingSword backgroundActivated={backgroundActivated} />
      <div>
        <span>{hours}:{minutes}.{seconds}</span>
      </div>
      <div>
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