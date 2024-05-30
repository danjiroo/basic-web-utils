"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequest = void 0;
/**
 * @remarks
 * This method invokes the setters of param 'request' that are provided on param 'properties'
 * */
const setRequest = (request, properties) => {
    const propKeys = Object.keys(properties);
    for (let c = 0; c < propKeys.length; c++) {
        const key = propKeys[c];
        const funcName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
        // @ts-ignore
        request[funcName](properties[key]);
    }
    return request;
};
exports.setRequest = setRequest;
