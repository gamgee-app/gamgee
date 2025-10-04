import { useEffect } from "react";

export const useCallWebhook = (
  swordIsGlowing: boolean,
  swordOnWebhookUrl: string | undefined,
  swordOffWebhookUrl: string | undefined,
) => {
  const callWebhook = (webhookUrl: string | undefined) => {
    if (!webhookUrl) {
      return;
    }
    fetch(webhookUrl, { method: "POST" });
  };

  useEffect(() => {
    if (swordIsGlowing) {
      callWebhook(swordOnWebhookUrl);
    } else {
      callWebhook(swordOffWebhookUrl);
    }
  }, [swordIsGlowing]);
};
