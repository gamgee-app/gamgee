export const useCallWebhook = (
  swordIsGlowing: boolean,
  webhookOnUrl: string | undefined,
  webhookOffUrl: string | undefined,
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
