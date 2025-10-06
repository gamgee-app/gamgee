import { useEffect } from "react";

export const useCallWebhook = (
  swordIsGlowing: boolean,
  swordOnWebhookUrl: string,
  swordOffWebhookUrl: string,
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
  }, [swordIsGlowing, swordOffWebhookUrl, swordOnWebhookUrl]);
};
