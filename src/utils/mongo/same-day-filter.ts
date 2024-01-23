import * as utils from '../index';
import * as dateConstants from '../../constants/date.constants';

export const sameDayFilter = (date: string | Date) => {
  return {
    $gte: new Date(utils.getStartOfDate(date, dateConstants.DATE_UNIT.DAY)),
    $lte: new Date(utils.getEndOfDate(date, dateConstants.DATE_UNIT.DAY)),
  };
};
