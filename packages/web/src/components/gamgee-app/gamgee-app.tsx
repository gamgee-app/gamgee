import { Alert, capitalize } from "@mui/material";
import { useServerState } from "../../api/useServerState";
import { StingComponent } from "../sting-component/sting-component";
import { SettingsPanel } from "../settings-panel/settings-panel";
import { ManualControls } from "../manual-controls/manual-controls";
import styles from "./gamgee-app.module.css";

export const GamgeeApp = () => {
  const snapshot = useServerState();

  if (!snapshot) {
    return (
      <div className={styles.appContainerOuter}>
        <div className={styles.appContainerInner}>
          <Alert severity="info">Connecting to server…</Alert>
        </div>
      </div>
    );
  }

  const heading = snapshot.movieTitle
    ? [snapshot.movieTitle, snapshot.editionLabel].filter(Boolean).join(" — ")
    : `No media (${capitalize(snapshot.playerState)})`;

  return (
    <div className={styles.appContainerOuter}>
      <div className={styles.appContainerInner}>
        {snapshot.movieTitle && (
          <StingComponent
            swordOn={snapshot.swordOn}
            chapterTitle={snapshot.chapterTitle}
            timestampMs={snapshot.timestampMs}
          />
        )}
        <Alert severity={snapshot.movieTitle ? "success" : "info"}>
          {heading}
        </Alert>
        <div className={styles.stingConfigGroup}>
          <SettingsPanel />
        </div>
        {snapshot.source === "manual" && (
          <div className={styles.stingConfigGroup}>
            <ManualControls snapshot={snapshot} />
          </div>
        )}
      </div>
    </div>
  );
};
