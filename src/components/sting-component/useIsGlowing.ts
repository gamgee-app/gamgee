import { useCallback, useEffect, useState } from "react";
import { EditionDifferenceData } from "../../movies/movies";

export const useIsGlowing = (
  differences: EditionDifferenceData[],
  timestamp: number,
) => {
  const [swordIsGlowing, setSwordIsGlowing] = useState<boolean>(false);

  const getDifference = useCallback(
    (time: number) =>
      differences.find(
        (difference) =>
          difference.start_time_ms < time && difference.end_time_ms > time,
      ),
    [differences],
  );

  useEffect(() => {
    const maybeDifference = getDifference(timestamp);
    setSwordIsGlowing(!!maybeDifference);
  }, [getDifference, swordIsGlowing, timestamp]);

  return swordIsGlowing;
};
