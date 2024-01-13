import * as dateConstants from '../../constants/date.constants';

import moment from 'moment';

export const parseDate = (
  date,
  {
    expectedFormats = [dateConstants.DATE_FORMAT.DATE_TIME],
    isStrict = true,
  } = {
    expectedFormats: [dateConstants.DATE_FORMAT.DATE_TIME],
    isStrict: true,
  },
): Date => {
  for (const format of expectedFormats) {
    if (moment(date, format, isStrict).isValid()) {
      return moment(date, format).toDate();
    }
  }

  throw new Error(
    `${date} does not match any format. Expected formats are [${expectedFormats.join(
      ', ',
    )}]`,
  );
};
