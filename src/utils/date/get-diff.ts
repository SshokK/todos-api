import type { MomentInput } from 'moment';

import moment from 'moment';

import * as dateConstants from '../../constants/date.constants';

export const getDiff = ({
  dateA,
  dateB,
  granularity,
}: {
  dateA: MomentInput;
  dateB: MomentInput;
  granularity: dateConstants.DATE_UNIT;
}): number => {
  return Math.abs(moment(dateA).diff(dateB, granularity, true));
};
