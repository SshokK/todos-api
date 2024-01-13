export type ControllerRouteData<
  QueryParams = unknown,
  Body = unknown,
  Response = unknown,
  UrlParams = unknown,
> = {
  queryParams: QueryParams;
  body: Body;
  response: Response;
  urlParams: UrlParams;
};
