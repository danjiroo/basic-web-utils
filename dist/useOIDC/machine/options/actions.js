"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const xstate_1 = require("xstate");
exports.actions = {
    assignAuthenticationResponse: (0, xstate_1.assign)((context, { payload }) => (Object.assign(Object.assign({}, context), payload))),
    incrementAuthenticationAttempts: (0, xstate_1.assign)({
        authenticationAttempts: ({ authenticationAttempts = 0 }) => authenticationAttempts + 1,
    }),
    removeAccessToken: (0, xstate_1.assign)((context) => (Object.assign(Object.assign({}, context), { isAuthenticated: false, accessToken: null }))),
};
