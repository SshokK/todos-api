import type * as mongoose from 'mongoose';
import type * as mongodb from 'mongodb';

import * as dateConstants from '../../../constants/date.constants';
import * as utils from '../../../utils';
import * as schema from '../schema';

export enum TODO_COUNT_AGGREGATION_KEY {
  DONE = 'Done',
  UNDONE = 'Undone',
  OVERDUE = 'Overdue',
}

export const TODO_COUNT_AGGREGATION_PIPELINES: Record<
  TODO_COUNT_AGGREGATION_KEY,
  (args: { date: Date }) => mongoose.PipelineStage.FacetPipelineStage[]
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
            utils.getStartOfDate(args.date, dateConstants.DATE_UNIT.DAY),
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
            utils.getStartOfDate(args.date, dateConstants.DATE_UNIT.DAY),
          ),
        },
      },
    },
    { $count: TODO_COUNT_AGGREGATION_KEY.OVERDUE },
  ],
};

export enum TODO_BULK_UPDATE_OPERATION_KEY {
  DECREASE_PREV_DAY_HIGHER_TODOS_ORDER = 'decreasePrevDayHigherTodosOrder',
  INCREASE_UPDATED_DAY_HIGHER_TODOS_ORDER = 'increaseUpdatedDayHigherTodosOrder',
  UPDATE_PREV_DAY_NEARBY_TODOS_ORDER = 'updatePrevDayNearbyTodosOrder',
}

export const TODO_BULK_UPDATE_OPERATIONS: Record<
  TODO_BULK_UPDATE_OPERATION_KEY,
  (args: {
    prevTodo: schema.Todo;
    updatedTodo: schema.Todo;
  }) => mongodb.AnyBulkWriteOperation<schema.Todo>
> = {
  [TODO_BULK_UPDATE_OPERATION_KEY.DECREASE_PREV_DAY_HIGHER_TODOS_ORDER]: (
    args,
  ) => ({
    updateMany: {
      filter: {
        $and: [
          {
            _id: { $ne: args.prevTodo._id },
          },
          {
            date: utils.sameDayFilter(args.prevTodo.date),
          },
          {
            order: {
              $gte: args.prevTodo.order,
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
  }),

  [TODO_BULK_UPDATE_OPERATION_KEY.INCREASE_UPDATED_DAY_HIGHER_TODOS_ORDER]: (
    args,
  ) => ({
    updateMany: {
      filter: {
        $and: [
          {
            _id: { $ne: args.updatedTodo._id },
          },
          {
            date: utils.sameDayFilter(args.updatedTodo.date),
          },
          {
            order: {
              $gte: args.updatedTodo.order,
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
  }),

  [TODO_BULK_UPDATE_OPERATION_KEY.UPDATE_PREV_DAY_NEARBY_TODOS_ORDER]: (
    args,
  ) => ({
    updateMany: {
      filter: {
        $and: [
          {
            _id: { $ne: args.prevTodo._id },
          },
          {
            date: utils.sameDayFilter(args.prevTodo.date),
          },
          {
            order: {
              ...(args.prevTodo.order < args.updatedTodo.order
                ? {
                    $gt: args.prevTodo.order,
                    $lte: args.updatedTodo.order,
                  }
                : {
                    $lt: args.prevTodo.order,
                    $gte: args.updatedTodo.order,
                  }),
            },
          },
        ],
      },
      update: {
        $inc: {
          order: args.prevTodo.order < args.updatedTodo.order ? -1 : 1,
        },
      },
    },
  }),
};
