import type * as types from './todo.controller.types';

import * as service from '../service';
import * as nestCommon from '@nestjs/common';
import * as constants from './todo.controller.constants';
import * as serializers from './todo.controller.serializers';
import * as requestConstants from '../../../constants/request.constants';
import * as utils from '../../../utils';
import * as schema from '../schema';

@nestCommon.Controller({
  path: constants.ROUTE_BASE,
  version: requestConstants.ROUTE_VERSION.V1,
})
@nestCommon.UseInterceptors(
  utils.MongooseClassSerializerInterceptor(schema.Todo),
)
export class TodoController {
  constructor(
    @nestCommon.Inject(nestCommon.forwardRef(() => service.TodoService))
    private readonly todoService: service.TodoService,
  ) {}

  /**
   *
   * Returns a paginated list of todos
   *
   */
  @nestCommon.Get()
  public async [constants.ROUTE.GET_TODOS](
    @nestCommon.Query(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.GET_TODOS].QUERY_PARAMS,
        nestCommon.BadRequestException,
      ),
    )
    queryParams: types.TodosController[constants.ROUTE.GET_TODOS]['queryParams'],
  ) {
    return this.todoService.findAll({
      limit: queryParams.limit,
      offset: queryParams.offset,
    });
  }

  /**
   *
   * Creates a new to do item and returns it
   *
   */
  @nestCommon.Post()
  public async [constants.ROUTE.CREATE_TODO](
    @nestCommon.Body(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.CREATE_TODO].BODY,
        nestCommon.BadRequestException,
      ),
    )
    body: types.TodosController[constants.ROUTE.CREATE_TODO]['body'],
  ) {
    return this.todoService.create(body);
  }

  /**
   *
   * Update an item by id and returns it
   *
   */
  @nestCommon.Patch(':id')
  public async [constants.ROUTE.UPDATE_TODO](
    @nestCommon.Param(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.UPDATE_TODO].URL_PARAMS,
        nestCommon.BadRequestException,
      ),
    )
    urlParams: types.TodosController[constants.ROUTE.UPDATE_TODO]['urlParams'],

    @nestCommon.Body(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.UPDATE_TODO].BODY,
        nestCommon.BadRequestException,
      ),
    )
    body: types.TodosController[constants.ROUTE.UPDATE_TODO]['body'],
  ) {
    return this.todoService.updateOne(urlParams.id, body);
  }

  /**
   *
   * Update an item by id and returns it
   *
   */
  @nestCommon.Delete(':id')
  public async [constants.ROUTE.DELETE_TODO](
    @nestCommon.Param(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.DELETE_TODO].URL_PARAMS,
        nestCommon.BadRequestException,
      ),
    )
    urlParams: types.TodosController[constants.ROUTE.DELETE_TODO]['urlParams'],
  ) {
    return this.todoService.deleteOne(urlParams.id);
  }

  /**
   *
   * Deletes multiple todos
   *
   */
  @nestCommon.Delete()
  public async [constants.ROUTE.BULK_DELETE_TODOS](
    @nestCommon.Body(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.BULK_DELETE_TODOS].BODY,
        nestCommon.BadRequestException,
      ),
    )
    body: types.TodosController[constants.ROUTE.BULK_DELETE_TODOS]['body'],
  ) {
    return this.todoService.deleteMany(body);
  }

  /**
   *
   * Gets counted todos
   *
   */
  @nestCommon.Get('/count')
  public async [constants.ROUTE.AGGREGATE_COUNT](
    @nestCommon.Query(
      new utils.ValidationPipe(
        serializers.SERIALIZERS[constants.ROUTE.AGGREGATE_COUNT].QUERY_PARAMS,
        nestCommon.BadRequestException,
      ),
    )
    queryParams: types.TodosController[constants.ROUTE.AGGREGATE_COUNT]['queryParams'],
  ) {
    return this.todoService.aggregateCount(queryParams);
  }
}
