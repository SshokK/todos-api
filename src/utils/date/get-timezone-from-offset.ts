import * as nestCommon from '@nestjs/common';

import moment from 'moment-timezone';

export const getTimezoneFromOffset = <T>(
  offset: string,
  options?: {
    fallback: T;
  },
) => {
  const potentialTimezones = moment.tz
    .names()
    .filter((tz) => moment.tz(tz).format('Z') === offset);

  if (potentialTimezones.length === 0) {
    if (!options.fallback) {
      throw new nestCommon.InternalServerErrorException(
        `Cannot determine timezone using the passed offset: ${offset}`,
      );
    }

    return options.fallback;
  }

  return potentialTimezones[0];
};
