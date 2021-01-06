import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

export type interval = 'day' | 'month' | 'year' | 'week';

@Injectable()
export default class TimePeriodService {
  period: number;
  interval: interval;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;

  init(
    interval?: interval,
    period?: number,
    start?: dayjs.ConfigType,
  ): TimePeriodService {
    const newStart = dayjs(start);
    const newPeriod = period || 1;
    const newInterval = interval ?? 'month';

    this.interval = newInterval;
    this.period = newPeriod;
    this.start = newStart;
    this.end = newStart.add(newPeriod, newInterval);

    return this;
  }
}
