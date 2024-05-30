import { FieldRules, Fields } from './types';
export declare const validateEmail: (email: string) => boolean;
export declare const validateMinLength: (valueLength: number, minLength: number) => boolean;
export declare const validateUrl: (url: string) => boolean;
export declare const validatePassword: (password: string) => boolean;
export interface ValidateParams {
    fields: Fields;
    fieldRules: FieldRules;
}
export declare const Validate: ({ fields, fieldRules, }: ValidateParams) => Fields['fields'];
