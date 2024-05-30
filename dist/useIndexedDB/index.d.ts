import { UseIndexedDBParams } from './types';
export declare const useIndexedDB: (params: UseIndexedDBParams) => {
    getKey: (key: string) => Promise<any>;
    setKey: (key: string, data: unknown) => Promise<void>;
};
