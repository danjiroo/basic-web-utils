"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoHashQueryStringUtils = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const appauth_1 = require("@openid/appauth");
class NoHashQueryStringUtils extends appauth_1.BasicQueryStringUtils {
    parse(input) {
        return super.parse(input, false /* never use hash */);
    }
}
exports.NoHashQueryStringUtils = NoHashQueryStringUtils;
