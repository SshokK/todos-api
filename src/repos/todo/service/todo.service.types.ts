import type { ListArgs, SortArgs } from '../../../types';

import type * as schema from '../schema';
import { DateArgs } from '../../../types';

export type TodoFilters = {
  id?: schema.Todo['id'][];
  title?: schema.Todo['title'];
  isDone?: schema.Todo['isDone'];
  dateRangeStart?: schema.Todo['date'];
  dateRangeEnd?: schema.Todo['date'];
};

export interface TodoService {
  findAll(
    args: ListArgs & SortArgs<keyof schema.Todo> & TodoFilters,
  ): Promise<schema.Todo[]>;

  getTotalCount(args: TodoFilters): Promise<number>;

  findOne(id: schema.Todo['_id']): Promise<schema.Todo>;

  getGroupedByDatesCount(
    args: ListArgs & Partial<DateArgs> & TodoFilters,
  ): Promise<
    {
      dateRangeStart: schema.Todo['date'];
      dateRangeEnd: schema.Todo['date'];
      count: number;
    }[]
  >;

  getCountByStatus(
    args: TodoFilters & {
      dueDate: Date;
    },
  ): Promise<{
    doneCount: number;
    overdueCount: number;
    undoneCount: number;
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

  deleteMany(args: TodoFilters): Promise<{
    deletedCount: number;
  }>;
}
