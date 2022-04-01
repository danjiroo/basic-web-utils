export interface IParams<T> {
  [key: string]: T;
}
export const convertToQueryParams = <Params>(params: IParams<Params>) => {
  let queryParams: string = '';
  if (params) {
    queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    if (queryParams.length > 0) {
      queryParams = '?' + queryParams;
    }
  }
  return queryParams;
};
