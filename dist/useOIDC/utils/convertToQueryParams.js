"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToQueryParams = void 0;
const convertToQueryParams = (params) => {
    let queryParams = '';
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
exports.convertToQueryParams = convertToQueryParams;
