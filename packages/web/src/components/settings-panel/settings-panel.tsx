import { useEffect, useId, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { api } from "../../api/client";
import type { Config, SourceKind } from "../../api/types";
import styles from "./settings-panel.module.css";

export const SettingsPanel = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceId = useId();

  useEffect(() => {
    void api.getConfig().then(setConfig);
  }, []);

  if (!config) return null;

  const update = (next: Config) => setConfig(next);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await api.putConfig(config);
      setConfig(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.panel}>
      <FormControl fullWidth>
        <InputLabel id={sourceId}>Source</InputLabel>
        <Select
          value={config.source.kind}
          labelId={sourceId}
          label="Source"
          onChange={(e) =>
            update({
              ...config,
              source: { ...config.source, kind: e.target.value as SourceKind },
            })
          }
        >
          <MenuItem value="manual">Manual</MenuItem>
          <MenuItem value="plex">Plex</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Sword On Webhook"
        value={config.webhooks.swordOn}
        onChange={(e) =>
          update({
            ...config,
            webhooks: { ...config.webhooks, swordOn: e.target.value },
          })
        }
      />
      <TextField
        label="Sword Off Webhook"
        value={config.webhooks.swordOff}
        onChange={(e) =>
          update({
            ...config,
            webhooks: { ...config.webhooks, swordOff: e.target.value },
          })
        }
      />
      <TextField
        label="Webhook Debounce (ms)"
        type="number"
        value={config.webhooks.debounceMs}
        onChange={(e) =>
          update({
            ...config,
            webhooks: {
              ...config.webhooks,
              debounceMs: Number(e.target.value) || 0,
            },
          })
        }
      />

      {config.source.kind === "plex" && (
        <>
          <TextField
            label="Plex Base URL"
            value={config.source.plex.baseUrl ?? ""}
            onChange={(e) =>
              update({
                ...config,
                source: {
                  ...config.source,
                  plex: { ...config.source.plex, baseUrl: e.target.value },
                },
              })
            }
          />
          <TextField
            label="Plex Token"
            type="password"
            value={config.source.plex.token ?? ""}
            onChange={(e) =>
              update({
                ...config,
                source: {
                  ...config.source,
                  plex: { ...config.source.plex, token: e.target.value },
                },
              })
            }
          />
          <TextField
            label="Plex Poll Interval (ms)"
            type="number"
            value={config.source.plex.pollMs}
            onChange={(e) =>
              update({
                ...config,
                source: {
                  ...config.source,
                  plex: {
                    ...config.source.plex,
                    pollMs: Number(e.target.value) || 1000,
                  },
                },
              })
            }
          />
        </>
      )}

      <div className={styles.actions}>
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => void api.testWebhook("on")}
          disabled={!config.webhooks.swordOn}
        >
          Test On
        </Button>
        <Button
          variant="outlined"
          onClick={() => void api.testWebhook("off")}
          disabled={!config.webhooks.swordOff}
        >
          Test Off
        </Button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
