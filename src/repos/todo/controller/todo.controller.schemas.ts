import * as dateConstants from '../../../constants/date.constants';
import * as constants from './todo.controller.constants';
import * as sortConstants from '../../../constants/sort.constants';
import * as utils from '../../../utils';

export const SCHEMAS = {
  [constants.ROUTE.GET_TODOS]: {
    QUERY_PARAMS: utils.schema.object({
      limit: utils.schema.number().min(0).max(1000).default(20),

      offset: utils.schema.number().min(0).default(0),

      id: utils.schema
        .array()
        .items(utils.schema.string())
        .single()
        .default([]),

      isDone: utils.schema.array().items(utils.schema.boolean()).single(),

      date: utils.schema.date().format(dateConstants.DATE_FORMAT.DATE),

      sortField: utils.schema
        .string()
        .valid(...constants.ALLOWED_SORT_FIELDS[constants.ROUTE.GET_TODOS])
        .default(constants.ALLOWED_SORT_FIELDS[constants.ROUTE.GET_TODOS][0]),

      sortOrder: utils.schema
        .string()
        .valid(...Object.values(sortConstants.SORT_ORDER))
        .default(sortConstants.SORT_ORDER.DESC),
    }),
  },

  [constants.ROUTE.CREATE_TODO]: {
    BODY: utils.schema
      .object({
        id: utils.schema
          .string()
          .guid({
            version: ['uuidv4'],
          })
          .default(utils.getRandomId),
        title: utils.schema.string().default(''),
        isDone: utils.schema.boolean().default(false),
        order: utils.schema.number().default(0),
        date: utils.schema.date().format(dateConstants.DATE_FORMAT.DATE).utc(),
      })
      .required(),
  },

  [constants.ROUTE.UPDATE_TODO]: {
    URL_PARAMS: utils.schema
      .object({
        id: utils.schema
          .string()
          .guid({
            version: ['uuidv4'],
          })
          .required(),
      })
      .required(),
    BODY: utils.schema
      .object({
        title: utils.schema.string().allow(''),
        isDone: utils.schema.boolean(),
        order: utils.schema.number(),
        date: utils.schema.date().format(dateConstants.DATE_FORMAT.DATE).utc(),
      })
      .required(),
  },

  [constants.ROUTE.DELETE_TODO]: {
    URL_PARAMS: utils.schema
      .object({
        id: utils.schema
          .string()
          .guid({
            version: ['uuidv4'],
          })
          .required(),
      })
      .required()
  },
};
