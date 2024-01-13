import * as joiBase from 'joi';
import joiDate from '@joi/date';

export const schema = joiBase.extend(joiDate);
