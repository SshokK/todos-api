import type * as schema from '../schema';

export const ROUTE_BASE = 'todos';

export const TAG = 'todos';

export enum ROUTE {
  GET_TODOS = 'getTodos',
  GET_TODOS_TOTAL_COUNT = 'totalCount',
  CREATE_TODO = 'createTodo',
  UPDATE_TODO = 'updateTodo',
  DELETE_TODO = 'deleteTodo',
  BULK_DELETE_TODOS = 'bulkDeleteTodos',
  GET_COUNT_BY_STATUS = 'getCountByStatus',
  GET_COUNT_BY_DATE = 'getCountByDate',
}

export const ALLOWED_SORT_FIELDS: (keyof schema.Todo)[] = [
  'id',
  'title',
  'content',
  'order',
  'isDone',
  'date',
  'updatedAt',
  'createdAt',
];
