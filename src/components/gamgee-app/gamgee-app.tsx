import { StingComponent } from "../sting-component/sting-component.tsx";
import { useCallback, useId, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ManualMetadataProvider } from "../manual-metadata-provider/manual-metadata-provider.tsx";
import {
  EditionMetadata,
  MetadataProviderProps,
} from "../metadata-provider/metadata-provider.ts";
import { useTimer } from "react-use-precision-timer";
import styles from "./gamgee-app.module.css";

const metadataProviders = ["Manual"] as const;
type MetadataProvider = (typeof metadataProviders)[number];

export const GamgeeApp = () => {
  const [metadataProvider, setMetadataProvider] =
    useState<MetadataProvider>("Manual");
  const [metadata, setMetadata] = useState<EditionMetadata | null>(null);
  const [timestamp, setTimestamp] = useState<number>(0);

  const updateElapsedTime = useCallback(() => {
    const elapsed = timer.getElapsedRunningTime();
    setTimestamp(elapsed);
  }, []);

  const timer = useTimer({ delay: 1000 / 24 }, updateElapsedTime);

  const providerLabelId = useId();
  const providerLabel = "Metadata Provider";

  const handleMetadataProviderChange = (
    event: SelectChangeEvent<MetadataProvider>,
  ) => {
    setMetadataProvider(event.target.value as MetadataProvider);
    setMetadata(null);
  };

  const metadataProviderProps: MetadataProviderProps = {
    timer,
    editionMetadata: metadata,
    setEditionMetadata: setMetadata,
  };

  return (
    <div className={styles.appContainerOuter}>
      <div className={styles.appContainerInner}>
        {metadata &&
          metadata.edition.differences &&
          metadata.edition.chapters && (
            <StingComponent
              differences={metadata.edition.differences}
              chapters={metadata.edition.chapters}
              timestamp={timestamp}
            />
          )}
        <FormControl className={styles.providerContainer}>
          <InputLabel id={providerLabelId}>{providerLabel}</InputLabel>
          <Select
            value={metadataProvider}
            labelId={providerLabelId}
            label={providerLabel}
            onChange={handleMetadataProviderChange}
          >
            {metadataProviders.map((provider) => (
              <MenuItem key={provider} value={provider}>
                {provider}
              </MenuItem>
            ))}
          </Select>
          {metadataProvider === "Manual" && (
            <ManualMetadataProvider {...metadataProviderProps} />
          )}
        </FormControl>
      </div>
    </div>
  );
};
