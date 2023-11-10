import { Dayjs } from "dayjs";

export class TimeSpan {
    public startTime: Dayjs | null;
    public endTime: Dayjs | null;

    constructor(startTime: Dayjs | null, endTime: Dayjs | null) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    getSecondsBetween(): number {
        if (this.startTime === null || this.endTime === null) return NaN;
        return this.endTime.diff(this.startTime, "seconds");
    }
}