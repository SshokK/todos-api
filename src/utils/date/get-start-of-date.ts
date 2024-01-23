import type { MomentInput } from 'moment';

import * as dateConstants from '../../constants/date.constants';

import moment from 'moment';

export const getStartOfDate = <F>(
  date: MomentInput,
  unitOfTime: dateConstants.DATE_UNIT,
  {
    format = dateConstants.DATE_FORMAT.ISO_DATE_TIME,
    passedDateFormat,
    emptyFallback = null,
  }: {
    format?: string;
    passedDateFormat?: string;
    emptyFallback?: F;
  } = {
    format: dateConstants.DATE_FORMAT.ISO_DATE_TIME,
    emptyFallback: null,
  },
) => {
  if (!date) {
    return emptyFallback;
  }

  return moment(date, passedDateFormat)
    .tz(dateConstants.TIMEZONE.UTC)
    .startOf(unitOfTime)
    .format(format);
};
