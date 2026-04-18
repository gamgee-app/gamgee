import { FC } from "react";
import styles from "./sting-sword.module.css";
import classNames from "classnames";

interface StingSwordProps {
  swordIsGlowing: boolean;
}

export const StingSword: FC<StingSwordProps> = ({ swordIsGlowing }) => {
  return (
    <div className={styles.stingContainer}>
      <div className={styles.stingSword}></div>
      <div
        className={
          swordIsGlowing
            ? classNames(styles.stingGlow, styles.stingGlowUp)
            : classNames(styles.stingGlow, styles.stingGlowDown)
        }
      ></div>
    </div>
  );
};
