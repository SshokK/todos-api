import * as dateConstants from '../../constants/date.constants';

import momentTimezone from 'moment-timezone';

export const formatDate = <F>(
  date,
  {
    format = dateConstants.DATE_FORMAT.DATE_TIME,
    timezone = dateConstants.TIMEZONE.UTC,
    passedTimezone,
    shouldKeepLocalTime = true,
    emptyFallback = null,
  }: {
    format: dateConstants.DATE_FORMAT;
    timezone: dateConstants.TIMEZONE;
    passedFormat?: dateConstants.DATE_FORMAT;
    passedTimezone?: dateConstants.TIMEZONE;
    shouldKeepLocalTime?: boolean;
    emptyFallback?: F;
  } = {
    format: dateConstants.DATE_FORMAT.DATE_TIME,
    timezone: dateConstants.TIMEZONE.UTC,
    emptyFallback: null,
  },
): string | F => {
  if (!date) {
    return emptyFallback;
  }

  const formattedDate = momentTimezone(date)
    .tz(passedTimezone, shouldKeepLocalTime)
    .tz(timezone)
    .format(format);

  if (formattedDate.toLowerCase().includes('invalid date')) {
    throw new Error('Cannot parse date');
  }

  return formattedDate;
};
