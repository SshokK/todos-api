import type { TodoService } from './todo.service.types';

import mongoose from 'mongoose';

import * as schema from '../schema';
import * as utils from '../../../utils';
import * as dateConstants from '../../../constants/date.constants';
import * as constants from './todo.service.constants';

export const getSameDateTodoMaxOrder = async (
  date: schema.Todo['date'],
  options: {
    model: mongoose.Model<schema.TodoDocument>;
  },
): Promise<schema.Todo['order']> => {
  const [result] = await options.model
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

export const getTodoMoveType = (
  todo: schema.Todo,
  options: {
    newTodoOrder: schema.Todo['order'];
    newTodoDate: schema.Todo['date'];
  },
): constants.TODO_MOVE_TYPE | null => {
  const wasMovedToAnotherDay =
    utils.getDiff({
      dateA: options.newTodoDate,
      dateB: todo.date,
      granularity: dateConstants.DATE_UNIT.DAY,
    }) > 0;

  switch (true) {
    case wasMovedToAnotherDay:
      return constants.TODO_MOVE_TYPE.ANOTHER_DAY;

    case todo.order !== options.newTodoOrder:
      return constants.TODO_MOVE_TYPE.SAME_DAY;

    default: {
      return null;
    }
  }
};

export const reflectOrderChange = async (
  todo: schema.Todo,
  options: {
    model: mongoose.Model<schema.TodoDocument>;
    args: Parameters<TodoService['updateOne']>[1];
  },
) => {
  const newTodoOrder = options.args.order ?? todo.order;
  const newTodoDate = options.args.date ?? todo.date;

  const moveType = getTodoMoveType(todo, {
    newTodoOrder,
    newTodoDate,
  });

  if (moveType) {
    await options.model.bulkWrite(
      constants.TODO_MOVE_OPERATIONS[moveType]({
        todo,
        options: {
          newTodoOrder,
          newTodoDate,
        },
      }),
    );
  }
};
