import { FC } from "react";
import styles from "./sting-sword.module.css";
import classNames from "classnames";

interface StingSwordProps {
  backgroundActivated: boolean;
}

export const StingSword : FC<StingSwordProps> = ({backgroundActivated}) => {
    return (<div className={styles.stingContainer}>
        <div className={styles.stingSword}></div>
        <div className={backgroundActivated ? classNames(styles.stingGlow, styles.stingGlowUp) : classNames(styles.stingGlow, styles.stingGlowDown)}></div>  
      </div>);
}