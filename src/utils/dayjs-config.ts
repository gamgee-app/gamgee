import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

// Extend dayjs with plugins globally
dayjs.extend(utc);

export default dayjs.utc;
export type { Dayjs };
