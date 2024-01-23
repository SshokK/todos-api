import type * as mongoose from 'mongoose';

import * as dateConstants from '../../../constants/date.constants';
import * as utils from '../../../utils';
import * as schema from '../schema';

export enum TODO_COUNT_AGGREGATION_KEY {
  DONE = 'Done',
  UNDONE = 'Undone',
  OVERDUE = 'Overdue',
  TOTAL = 'Total',
}

export const TODO_COUNT_AGGREGATION_PIPELINES: Record<
  TODO_COUNT_AGGREGATION_KEY,
  (args: { currentDate: string }) => mongoose.PipelineStage.FacetPipelineStage[]
> = {
  [TODO_COUNT_AGGREGATION_KEY.DONE]: () => [
    { $match: { isDone: true } },
    { $count: TODO_COUNT_AGGREGATION_KEY.DONE },
  ],

  [TODO_COUNT_AGGREGATION_KEY.UNDONE]: (args) => [
    {
      $match: {
        isDone: false,
        date: {
          $gte: new Date(
            utils.getStartOfDate(args.currentDate, dateConstants.DATE_UNIT.DAY),
          ),
        },
      },
    },
    { $count: TODO_COUNT_AGGREGATION_KEY.UNDONE },
  ],

  [TODO_COUNT_AGGREGATION_KEY.OVERDUE]: (args) => [
    {
      $match: {
        isDone: false,
        date: {
          $lt: new Date(
            utils.getStartOfDate(args.currentDate, dateConstants.DATE_UNIT.DAY),
          ),
        },
      },
    },
    { $count: TODO_COUNT_AGGREGATION_KEY.OVERDUE },
  ],

  [TODO_COUNT_AGGREGATION_KEY.TOTAL]: () => [
    {
      $match: {},
    },
    { $count: TODO_COUNT_AGGREGATION_KEY.TOTAL },
  ],
};

export enum TODO_MOVE_TYPE {
  SAME_DAY = 'sameDay',
  ANOTHER_DAY = 'anotherDay',
}

export const TODO_MOVE_OPERATIONS = {
  [TODO_MOVE_TYPE.ANOTHER_DAY]: (args: {
    todo: schema.Todo;
    options: {
      newTodoOrder: schema.Todo['order'];
      newTodoDate: schema.Todo['date'];
    };
  }) => [
    /**
     *
     * Item was moved to another day
     * Lower the previous day todos order by 1, if their order was
     * higher than the updated item's order
     *
     */
    {
      updateMany: {
        filter: {
          $and: [
            {
              _id: { $ne: args.todo._id },
            },
            {
              date: utils.sameDayFilter(args.todo.date),
            },
            {
              order: {
                $gte: args.todo.order,
              },
            },
          ],
        },
        update: {
          $inc: {
            order: -1,
          },
        },
      },
    },
    /**
     *
     * Increase the order of the higher items that are within the updated day
     *
     */
    {
      updateMany: {
        filter: {
          $and: [
            {
              _id: { $ne: args.todo._id },
            },
            {
              date: utils.sameDayFilter(args.options.newTodoDate),
            },
            {
              order: {
                $gte: args.options.newTodoOrder,
              },
            },
          ],
        },
        update: {
          $inc: {
            order: 1,
          },
        },
      },
    },
  ],
  [TODO_MOVE_TYPE.SAME_DAY]: (args: {
    todo: schema.Todo;
    options: {
      newTodoOrder: schema.Todo['order'];
      newTodoDate: schema.Todo['date'];
    };
  }) => [
    /**
     *
     * Item was moved within the same day
     * Update the same day items orders
     *
     */
    {
      updateMany: {
        filter: {
          $and: [
            {
              _id: { $ne: args.todo._id },
            },
            {
              date: utils.sameDayFilter(args.todo.date),
            },
            {
              order: {
                ...(args.todo.order < args.options.newTodoOrder
                  ? {
                      $gt: args.todo.order,
                      $lte: args.options.newTodoOrder,
                    }
                  : {
                      $lt: args.todo.order,
                      $gte: args.options.newTodoOrder,
                    }),
              },
            },
          ],
        },
        update: {
          $inc: {
            order: args.todo.order < args.options.newTodoOrder ? -1 : 1,
          },
        },
      },
    },
  ],
};
