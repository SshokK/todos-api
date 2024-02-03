import type * as types from './todo.service.types';

import * as nestCommon from '@nestjs/common';
import * as nestMongoose from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schema from '../schema';
import * as utils from '../../../utils';
import * as dateConstants from '../../../constants/date.constants';
import * as constants from './todo.service.constants';
import * as sortConstants from '../../../constants/sort.constants';

@nestCommon.Injectable()
export class TodoService implements types.TodoService {
  constructor(
    @nestMongoose.InjectModel(schema.Todo.name)
    private todoModel: mongoose.Model<schema.TodoDocument>,
  ) {}

  findAll: types.TodoService['findAll'] = (args) => {
    return this.todoModel
      .find({
        ...(Boolean(args.id?.length) && {
          _id: { $in: args.id },
        }),

        ...(utils.isBoolean(args.isDone) && {
          isDone: args.isDone,
        }),

        ...(Boolean(args.dateRangeStart || args.dateRangeEnd) && {
          date: {
            ...(Boolean(args.dateRangeStart) && {
              $gte: utils.getStartOfDate(
                args.dateRangeStart,
                dateConstants.DATE_UNIT.DAY,
                {
                  emptyFallback: null,
                },
              ),
            }),

            ...(Boolean(args.dateRangeEnd) && {
              $lte: utils.getEndOfDate(
                args.dateRangeEnd,
                dateConstants.DATE_UNIT.DAY,
                {
                  emptyFallback: null,
                },
              ),
            }),
          },
        }),
      })
      .sort({
        [args.sortField]:
          args.sortOrder === sortConstants.SORT_ORDER.ASC ? 1 : -1,
      })
      .skip(args.offset)
      .limit(args.limit)
      .exec();
  };

  getTotalCount: types.TodoService['getTotalCount'] = (args) => {
    return this.todoModel.countDocuments({
      ...(Boolean(args.id?.length) && {
        _id: { $in: args.id },
      }),

      ...(utils.isBoolean(args.isDone) && {
        isDone: args.isDone,
      }),

      ...(Boolean(args.dateRangeStart || args.dateRangeEnd) && {
        date: {
          ...(Boolean(args.dateRangeStart) && {
            $gte: utils.getStartOfDate(
              args.dateRangeStart,
              dateConstants.DATE_UNIT.DAY,
              {
                emptyFallback: null,
              },
            ),
          }),

          ...(Boolean(args.dateRangeEnd) && {
            $lte: utils.getEndOfDate(
              args.dateRangeEnd,
              dateConstants.DATE_UNIT.DAY,
              {
                emptyFallback: null,
              },
            ),
          }),
        },
      }),
    });
  };

  findOne: types.TodoService['findOne'] = async (id) => {
    const todo = await this.todoModel.findById(id).exec();

    if (!todo) {
      throw new nestCommon.NotFoundException();
    }

    return todo;
  };

  aggregateCount: types.TodoService['aggregateCount'] = async ({
    currentDate,
  }) => {
    const [result] = await this.todoModel.aggregate<
      Awaited<ReturnType<types.TodoService['aggregateCount']>>
    >([
      {
        $facet: Object.fromEntries(
          Object.entries(constants.TODO_COUNT_AGGREGATION_PIPELINES).map(
            ([aggregationKey, pipeline]) => [
              aggregationKey,
              pipeline({ currentDate }),
            ],
          ),
        ),
      },
      {
        $project: Object.fromEntries(
          Object.entries(constants.TODO_COUNT_AGGREGATION_PIPELINES).map(
            ([aggregationKey]) => [
              utils.camelCase(`${aggregationKey}Count`),
              {
                $ifNull: [
                  { $arrayElemAt: [`$${aggregationKey}.${aggregationKey}`, 0] },
                  0,
                ],
              },
            ],
          ),
        ),
      },
    ]);

    return result;
  };

  getSameDayTodoHighestOrder: types.TodoService['getSameDayTodoHighestOrder'] =
    async (date) => {
      const [result] = await this.todoModel
        .aggregate<{
          maxOrder: number;
        }>([
          {
            $match: {
              date: utils.sameDayFilter(date),
            },
          },
          { $group: { _id: null, maxOrder: { $max: '$order' } } },
        ])
        .exec();

      if (!result) {
        return 0;
      }

      return result.maxOrder;
    };

  create: types.TodoService['create'] = async (args) => {
    const sameDateTodoMaxOrder = await this.getSameDayTodoHighestOrder(
      args.date,
    );

    const todo = await new this.todoModel({
      ...args,
      _id: args.id,
      order:
        utils.isNumber(args.order) && args.order <= sameDateTodoMaxOrder
          ? args.order
          : sameDateTodoMaxOrder + 1,
    }).save();

    if (utils.isNumber(args.order)) {
      await this.todoModel.bulkWrite([
        constants.TODO_BULK_UPDATE_OPERATIONS[
          constants.TODO_BULK_UPDATE_OPERATION_KEY
            .UPDATE_PREV_DAY_NEARBY_TODOS_ORDER
        ]({
          prevTodo: todo,
          updatedTodo: todo,
        }),
      ]);
    }

    return todo;
  };

  updateOne: types.TodoService['updateOne'] = async (id, args) => {
    const prevTodo = await this.findOne(id);

    const updatedTodo = await this.todoModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        args,
        {
          new: true,
        },
      )
      .exec();

    const wasMovedToAnotherDay =
      utils.getDiff({
        dateA: prevTodo.date,
        dateB: updatedTodo.date,
        granularity: dateConstants.DATE_UNIT.DAY,
      }) > 0;

    const wasMovedWithinTheSameDay =
      !wasMovedToAnotherDay && prevTodo.order !== updatedTodo.order;

    if (wasMovedToAnotherDay) {
      await this.todoModel.bulkWrite([
        constants.TODO_BULK_UPDATE_OPERATIONS[
          constants.TODO_BULK_UPDATE_OPERATION_KEY
            .DECREASE_PREV_DAY_HIGHER_TODOS_ORDER
        ]({
          prevTodo: prevTodo,
          updatedTodo: updatedTodo,
        }),

        constants.TODO_BULK_UPDATE_OPERATIONS[
          constants.TODO_BULK_UPDATE_OPERATION_KEY
            .INCREASE_UPDATED_DAY_HIGHER_TODOS_ORDER
        ]({
          prevTodo: prevTodo,
          updatedTodo: updatedTodo,
        }),
      ]);
    }

    if (wasMovedWithinTheSameDay) {
      await this.todoModel.bulkWrite([
        constants.TODO_BULK_UPDATE_OPERATIONS[
          constants.TODO_BULK_UPDATE_OPERATION_KEY
            .UPDATE_PREV_DAY_NEARBY_TODOS_ORDER
        ]({
          prevTodo: prevTodo,
          updatedTodo: updatedTodo,
        }),
      ]);
    }

    return updatedTodo;
  };

  deleteOne: types.TodoService['deleteOne'] = async (id) => {
    const todo = await this.findOne(id);

    await Promise.all([
      /**
       * Update the same day higher todos orders
       */
      this.todoModel.bulkWrite([
        constants.TODO_BULK_UPDATE_OPERATIONS[
          constants.TODO_BULK_UPDATE_OPERATION_KEY
            .DECREASE_PREV_DAY_HIGHER_TODOS_ORDER
        ]({
          prevTodo: todo,
          updatedTodo: todo,
        }),
      ]),

      /**
       * Delete the entry
       */
      this.todoModel.deleteOne({
        _id: id,
      }),
    ]);
  };

  deleteMany: types.TodoService['deleteMany'] = async (args) => {
    const { deletedCount } = await this.todoModel
      .deleteMany({
        ...(Boolean(args.ids?.length) && {
          _id: { $in: args.ids },
        }),

        ...(utils.isBoolean(args.isDone) && {
          isDone: args.isDone,
        }),

        ...(Boolean(args.date?.rangeStart || args.date?.rangeEnd) && {
          date: {
            ...(Boolean(args.date.rangeStart) && {
              $gte: utils.getStartOfDate(
                args.date.rangeStart,
                dateConstants.DATE_UNIT.DAY,
                {
                  emptyFallback: null,
                },
              ),
            }),

            ...(Boolean(args.date.rangeEnd) && {
              $lt: utils.getEndOfDate(
                args.date.rangeEnd,
                dateConstants.DATE_UNIT.DAY,
                {
                  emptyFallback: null,
                },
              ),
            }),
          },
        }),
      })
      .exec();

    return {
      deletedCount,
    };
  };
}
