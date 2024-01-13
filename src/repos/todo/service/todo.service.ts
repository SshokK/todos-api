import type * as types from './todo.service.types';

import * as nestCommon from '@nestjs/common';
import * as nestMongoose from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schema from '../schema';

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

  create: types.TodoService['create'] = async (args) => {
    return new this.todoModel({
      ...args,
      _id: args.id,
    }).save();
  };

  updateOne: types.TodoService['updateOne'] = async (id, args) => {
    await this.todoModel.updateOne(
      {
        _id: id,
      },
      args,
    );

    return this.findOne(id);
  };

  deleteOne: types.TodoService['deleteOne'] = async (id) => {
    await this.todoModel.deleteOne({
      _id: id,
    });
  };
}
