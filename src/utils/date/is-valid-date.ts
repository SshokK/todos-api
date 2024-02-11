import type { MomentInput } from 'moment';

import * as dateConstants from '../../constants/date.constants';

import moment from 'moment';

export const isValidDate = (
  date: MomentInput,
  {
    format = dateConstants.DATE_FORMAT.ISO_DATE_TIME,
  }: {
    format?: string;
  } = {
    format: dateConstants.DATE_FORMAT.ISO_DATE_TIME,
  },
) => {
  return moment(date, format, Boolean(format)).isValid();
};
