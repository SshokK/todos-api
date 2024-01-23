import * as schema from '../schema';

export const ROUTE_BASE = 'todos';

export enum ROUTE {
  GET_TODOS = 'getTodos',
  CREATE_TODO = 'createTodo',
  UPDATE_TODO = 'updateTodo',
  DELETE_TODO = 'deleteTodo',
  BULK_DELETE_TODOS = 'bulkDeleteTodos',
  AGGREGATE_COUNT = 'aggregateCount',
}

export const ALLOWED_SORT_FIELDS: Record<
  ROUTE.GET_TODOS,
  (keyof schema.Todo)[]
> = {
  [ROUTE.GET_TODOS]: ['_id', 'createdAt', 'updatedAt'],
};
