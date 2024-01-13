import type * as schema from '../schema';

export interface TodoService {
  findAll(args: { limit: number; offset: number }): Promise<schema.Todo[]>;

  getTotalCount(): Promise<number>;

  findOne(id: schema.Todo['_id']): Promise<schema.Todo>;

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
}
