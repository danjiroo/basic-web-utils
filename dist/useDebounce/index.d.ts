interface ISend {
    type: string;
    payload?: any;
}
interface IDebounceParams {
    input: any;
    actions_type: Partial<string>;
    send: (params: ISend) => void;
}
export declare const useDebounce: ({ input, actions_type, send }: IDebounceParams) => void;
export {};
