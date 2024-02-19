import type * as classTransformer from 'class-transformer';
import type * as sortConstants from '../constants/sort.constants';

export type TransformerArgFunc<T> = (
  params: Parameters<Parameters<typeof classTransformer.Transform>[0]>[0],
) => T;

export type ListArgs = {
  limit: number;
  offset: number;
};

export type DateArgs = {
  timezone: string;
};

export type SortArgs<T extends string> = {
  sortField?: T;
  sortOrder?: sortConstants.SORT_ORDER;
};
