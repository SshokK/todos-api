import type * as schema from '../schema';
import type * as sortConstants from '../../../constants/sort.constants';

export interface TodoService {
  findAll(args: {
    limit: number;
    offset: number;
    id?: schema.Todo['id'][];
    isDone?: schema.Todo['isDone'];
    sortField?: keyof schema.Todo;
    sortOrder?: sortConstants.SORT_ORDER;
    dateRangeStart?: schema.Todo['date'];
    dateRangeEnd?: schema.Todo['date'];
  }): Promise<schema.Todo[]>;

  getTotalCount(args: {
    id?: schema.Todo['id'][];
    isDone?: schema.Todo['isDone'];
    dateRangeStart?: schema.Todo['date'];
    dateRangeEnd?: schema.Todo['date'];
  }): Promise<number>;

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
    id: schema.Todo['id'],
    args: {
      order?: schema.Todo['order'];
      title?: schema.Todo['title'];
      isDone?: schema.Todo['isDone'];
      date?: schema.Todo['date'];
    },
  ): Promise<schema.Todo>;

  deleteOne(id: schema.Todo['id']): Promise<void>;

  deleteMany(args: {
    ids?: schema.Todo['id'][];
    isDone?: schema.Todo['isDone'];
    date?: {
      rangeStart?: schema.Todo['date'];
      rangeEnd?: schema.Todo['date'];
    };
  }): Promise<{
    deletedCount: number;
  }>;
}
