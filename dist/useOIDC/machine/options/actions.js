"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const xstate_1 = require("xstate");
const { REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING = "" } = process.env;
exports.actions = {
    assignAuthenticationResponse: (0, xstate_1.assign)((context, { payload }) => (Object.assign(Object.assign({}, context), payload))),
    assignManuallyFetchedAccessToken: (0, xstate_1.assign)((context) => {
        return {
            accessToken: REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING,
            isAuthenticated: true,
        };
    }),
    incrementAuthenticationAttempts: (0, xstate_1.assign)({
        authenticationAttempts: ({ authenticationAttempts = 0 }) => authenticationAttempts + 1,
    }),
    removeAccessToken: (0, xstate_1.assign)((context) => (Object.assign(Object.assign({}, context), { isAuthenticated: false, accessToken: null }))),
    updateUrlParams: (0, xstate_1.assign)((context, { payload }) => (Object.assign(Object.assign({}, context), payload))),
    clearUrlParams: (0, xstate_1.assign)((context) => (Object.assign(Object.assign({}, context), { instanceGuid: "", signatoryGuid: "", claimCode: "", anonymousLogin: false, loggedInAsGuest: false }))),
    assignLoggedInAsGuest: (0, xstate_1.assign)((context) => (Object.assign(Object.assign({}, context), { loggedInAsGuest: true }))),
    setAuthorizeToTrue: (0, xstate_1.assign)((context) => (Object.assign(Object.assign({}, context), { isAuthorized: true }))),
    logTokenExpired: () => console.log("Token expired."),
};
