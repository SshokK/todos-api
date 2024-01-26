import type * as schema from '../schema';

export interface TodoService {
  findAll(args: { limit: number; offset: number }): Promise<schema.Todo[]>;

  getTotalCount(): Promise<number>;

  findOne(id: schema.Todo['_id']): Promise<schema.Todo>;

  aggregateCount(args: { currentDate: Date }): Promise<{
    doneCount: number;
    overdueCount: number;
    undoneCount: number;
    totalCount: number;
  }>;

  getSameDayTodoHighestOrder(
    date: schema.Todo['date'],
  ): Promise<schema.Todo['order']>;

  create(args: {
    id?: schema.Todo['_id'];
    order?: schema.Todo['order'];
    title?: schema.Todo['title'];
    isDone?: schema.Todo['isDone'];
    date?: schema.Todo['date'];
  }): Promise<schema.Todo>;

  updateOne(
    id: schema.Todo['_id'],
    args: {
      order?: schema.Todo['order'];
      title?: schema.Todo['title'];
      isDone?: schema.Todo['isDone'];
      date?: schema.Todo['date'];
    },
  ): Promise<schema.Todo>;

  deleteOne(id: schema.Todo['_id']): Promise<void>;

  deleteMany(args: {
    ids?: schema.Todo['_id'][];
    isDone?: schema.Todo['isDone'];
    date?: {
      rangeStart?: schema.Todo['date'];
      rangeEnd?: schema.Todo['date'];
    };
  }): Promise<{
    deletedCount: number;
  }>;
}
