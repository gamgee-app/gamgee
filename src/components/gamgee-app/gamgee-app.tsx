import { StingComponent } from "../sting-component/sting-component.tsx";
import { useId, useState } from "react";
import {
  Alert,
  capitalize,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ManualMetadataProvider } from "../manual-metadata-provider/manual-metadata-provider.tsx";
import { PlexMetadataProvider } from "../plex-metadata-provider/plex-metadata-provider.tsx";
import {
  EditionMetadata,
  MetadataProviderProps,
} from "../metadata-provider/metadata-provider.ts";
import styles from "./gamgee-app.module.css";
import { useMediaTimer } from "../../hooks/media-timer/useMediaTimer.tsx";

const metadataProviders = ["Manual", "Plex"] as const;
type MetadataProvider = (typeof metadataProviders)[number];

export const GamgeeApp = () => {
  const [metadataProvider, setMetadataProvider] =
    useState<MetadataProvider>("Manual");
  const [metadata, setMetadata] = useState<EditionMetadata | null>(null);
  const { mediaTimerProperties, mediaTimerActions } = useMediaTimer(24);

  const [swordOnWebhookUrl, setSwordOnWebhookUrl] = useState<string>("");
  const [swordOffWebhookUrl, setSwordOffWebhookUrl] = useState<string>("");

  const providerLabelId = useId();
  const providerLabel = "Metadata Provider";

  const handleMetadataProviderChange = (
    event: SelectChangeEvent<MetadataProvider>,
  ) => {
    setMetadataProvider(event.target.value as MetadataProvider);
    setMetadata(null);
    mediaTimerActions.stop();
  };

  const metadataProviderProps: MetadataProviderProps = {
    editionMetadata: metadata,
    setEditionMetadata: setMetadata,
    mediaTimerProperties,
    mediaTimerActions,
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
              timestamp={mediaTimerProperties.timestamp}
              swordOnWebhookUrl={swordOnWebhookUrl}
              swordOffWebhookUrl={swordOffWebhookUrl}
            />
          )}
        <Alert severity="info">{capitalize(mediaTimerProperties.state)}</Alert>
        <div className={styles.providerContainer}>
          <TextField
            value={swordOnWebhookUrl}
            label="Sword On Webhook"
            onChange={(newUrlEvent) =>
              setSwordOnWebhookUrl(newUrlEvent.target.value)
            }
          />
          <TextField
            value={swordOffWebhookUrl}
            label="Sword Off Webhook"
            onChange={(newUrlEvent) =>
              setSwordOffWebhookUrl(newUrlEvent.target.value)
            }
          />
          <FormControl>
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
          </FormControl>
        </div>
        <div className={styles.providerContainer}>
          {metadataProvider === "Manual" && (
            <ManualMetadataProvider {...metadataProviderProps} />
          )}
          {metadataProvider === "Plex" && (
            <PlexMetadataProvider {...metadataProviderProps} />
          )}
        </div>
      </div>
    </div>
  );
};
