import type * as types from './todo.service.types';

import * as nestCommon from '@nestjs/common';
import * as nestMongoose from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schema from '../schema';
import * as utils from '../../../utils';
import * as dateConstants from '../../../constants/date.constants';
import * as constants from './todo.service.constants';
import * as helpers from './todo.service.helpers';

@nestCommon.Injectable()
export class TodoService implements types.TodoService {
  constructor(
    @nestMongoose.InjectModel(schema.Todo.name)
    private todoModel: mongoose.Model<schema.TodoDocument>,
  ) {}

  findAll: types.TodoService['findAll'] = (args) => {
    return this.todoModel
      .find(helpers.applyTodoFilters(args))
      .sort(helpers.applySort(args))
      .skip(args.offset)
      .limit(args.limit)
      .exec();
  };

  getTotalCount: types.TodoService['getTotalCount'] = (args) => {
    return this.todoModel.countDocuments(helpers.applyTodoFilters(args));
  };

  findOne: types.TodoService['findOne'] = async (id) => {
    const todo = await this.todoModel.findById(id).exec();

    if (!todo) {
      throw new nestCommon.NotFoundException();
    }

    return todo;
  };

  getGroupedByDatesCount: types.TodoService['getGroupedByDatesCount'] = async (
    args,
  ) => {
    const timezone = args.timezone ?? dateConstants.TIMEZONE.UTC;

    return this.todoModel.aggregate([
      {
        $match: helpers.applyTodoFilters(args),
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$date', timezone } },
            month: { $month: { date: '$date', timezone } },
            day: {
              $dayOfMonth: { date: '$date', timezone },
            },
          },

          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: {
                $concat: [
                  {
                    $toString: '$_id.year',
                  },
                  '-',
                  {
                    $toString: '$_id.month',
                  },
                  '-',
                  {
                    $toString: '$_id.day',
                  },
                ],
              },
              format: '%Y-%m-%d',
              timezone: timezone,
            },
          },
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $skip: args.offset,
      },
      {
        $limit: args.limit,
      },
      {
        $project: {
          date: 1,
          count: 2,
          _id: 0,
        },
      },
    ]);
  };

  getCountByStatus: types.TodoService['getCountByStatus'] = async (args) => {
    const [result] = await this.todoModel.aggregate<
      Awaited<ReturnType<types.TodoService['getCountByStatus']>>
    >([
      {
        $match: helpers.applyTodoFilters(args),
      },
      {
        $facet: Object.fromEntries(
          Object.entries(constants.TODO_COUNT_AGGREGATION_PIPELINES).map(
            ([aggregationKey, pipeline]) => [
              aggregationKey,
              pipeline({ dueDate: args.dueDate }),
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
      .deleteMany(helpers.applyTodoFilters(args))
      .exec();

    return {
      deletedCount,
    };
  };
}
