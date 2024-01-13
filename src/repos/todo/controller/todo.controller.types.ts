import type * as constants from './todo.controller.constants';
import type * as schema from '../schema';
import type * as service from '../service';
import type * as controllerTypes from '../../../types/controller.types';
import type * as sortConstants from '../../../constants/sort.constants';

export interface TodosController {
  [constants.ROUTE.GET_TODOS]: controllerTypes.ControllerRouteData<
    {
      limit: number;
      offset: number;
      id?: schema.Todo['_id'][];
      isDone?: schema.Todo['isDone'];
      title?: schema.Todo['title'];
      createdAt?: schema.Todo['createdAt'];
      updatedAt?: schema.Todo['updatedAt'];
      sortField?: keyof schema.Todo;
      sortOrder?: sortConstants.SORT_ORDER;
    },
    never,
    {
      results: Awaited<
        ReturnType<InstanceType<typeof service.TodoService>['findAll']>
      >;
      totalCount: Awaited<
        ReturnType<InstanceType<typeof service.TodoService>['getTotalCount']>
      >;
    }
  >;

  [constants.ROUTE.CREATE_TODO]: controllerTypes.ControllerRouteData<
    never,
    {
      id?: schema.Todo['_id'];
      isDone?: schema.Todo['isDone'];
      title?: schema.Todo['title'];
      order?: schema.Todo['order'];
      date?: schema.Todo['date'];
    },
    Awaited<ReturnType<service.TodoService['create']>>
  >;

  [constants.ROUTE.UPDATE_TODO]: controllerTypes.ControllerRouteData<
    never,
    {
      isDone?: schema.Todo['isDone'];
      title?: schema.Todo['title'];
      order?: schema.Todo['order'];
      date?: schema.Todo['date'];
    },
    Awaited<ReturnType<service.TodoService['create']>>,
    {
      id: schema.Todo['_id'];
    }
  >;

  [constants.ROUTE.DELETE_TODO]: controllerTypes.ControllerRouteData<
    never,
    never,
    Awaited<ReturnType<service.TodoService['create']>>,
    {
      id: schema.Todo['_id'];
    }
  >;
}
