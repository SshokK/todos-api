import * as uuid from 'uuid';

export const getRandomId = (): string => {
  return uuid.v4();
}