export interface IParams<T> {
    [key: string]: T;
}
export declare const convertToQueryParams: <Params>(params: IParams<Params>) => string;
