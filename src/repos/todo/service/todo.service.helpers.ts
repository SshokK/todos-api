import type { TodoFilters } from './todo.service.types';
import type { SortArgs } from '../../../types';
import type * as schema from '../schema';

import * as utils from '../../../utils';
import * as sortConstants from '../../../constants/sort.constants';

export const applyTodoFilters = (args: TodoFilters) => {
  return {
    ...(Boolean(args.id?.length) && {
      _id: { $in: args.id },
    }),

    ...(Boolean(args.title) && {
      title: {
        $regex: args.title,
        $options: 'i',
      },
    }),

    ...(utils.isBoolean(args.isDone) && {
      isDone: args.isDone,
    }),

    ...(Boolean(args.dateRangeStart || args.dateRangeEnd) && {
      date: {
        ...(Boolean(args.dateRangeStart) && {
          $gte: args.dateRangeStart,
        }),

        ...(Boolean(args.dateRangeEnd) && {
          $lte: args.dateRangeEnd,
        }),
      },
    }),
  };
};

export const applySort = (
  args: SortArgs<keyof schema.Todo>,
): [string, sortConstants.SORT_ORDER][] => {
  return [[args.sortField, args.sortOrder ?? sortConstants.SORT_ORDER.DESC]];
};
