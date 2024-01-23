import type * as types from './todo.service.types';

import * as nestCommon from '@nestjs/common';
import * as nestMongoose from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schema from '../schema';
import * as utils from '../../../utils';
import * as dateConstants from '../../../constants/date.constants';
import * as constants from './todo.service.constants';
import * as helpers from './todo.service.helpers';
import { reflectOrderChange } from './todo.service.helpers';

@nestCommon.Injectable()
export class TodoService implements types.TodoService {
  constructor(
    @nestMongoose.InjectModel(schema.Todo.name)
    private todoModel: mongoose.Model<schema.TodoDocument>,
  ) {}

  findAll: types.TodoService['findAll'] = (args) => {
    return this.todoModel
      .find()
      .sort({ createdAt: -1 })
      .skip(args.offset)
      .limit(args.limit)
      .exec();
  };

  getTotalCount: types.TodoService['getTotalCount'] = () => {
    return this.todoModel.countDocuments();
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

  create: types.TodoService['create'] = async (args) => {
    const sameDateTodoMaxOrder = await helpers.getSameDateTodoMaxOrder(
      args.date,
      {
        model: this.todoModel,
      },
    );

    return new this.todoModel({
      ...args,
      _id: args.id,
      order: sameDateTodoMaxOrder + 1,
    }).save();
  };

  updateOne: types.TodoService['updateOne'] = async (id, args) => {
    const todo = await this.findOne(id);

    await this.todoModel.findOneAndUpdate(
      {
        _id: id,
      },
      args,
    );

    await helpers.reflectOrderChange(todo, {
      args: args,
      model: this.todoModel,
    });

    return this.findOne(id);
  };

  deleteOne: types.TodoService['deleteOne'] = async (id) => {
    await this.todoModel.deleteOne({
      _id: id,
    });
  };

  deleteMany: types.TodoService['deleteMany'] = async (args) => {
    const { deletedCount } = await this.todoModel
      .deleteMany({
        ...(Boolean(args.filters.ids.length) && {
          _id: { $in: args.filters.ids },
        }),

        ...(utils.isBoolean(args.filters.isDone) && {
          isDone: args.filters.isDone,
        }),

        ...(Boolean(
          args.filters.date?.rangeStart || args.filters.date?.rangeEnd,
        ) && {
          date: {
            ...(Boolean(args.filters.date.rangeStart) && {
              $gte: utils.getStartOfDate(
                args.filters.date.rangeStart,
                dateConstants.DATE_UNIT.DAY,
                {
                  emptyFallback: null,
                },
              ),
            }),

            ...(Boolean(args.filters.date.rangeEnd) && {
              $lt: utils.getEndOfDate(
                args.filters.date.rangeEnd,
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
