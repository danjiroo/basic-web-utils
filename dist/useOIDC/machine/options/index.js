"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const actions_1 = require("./actions");
const services_1 = require("./services");
const { REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING = "" } = process.env;
exports.options = {
    actions: actions_1.actions,
    services: services_1.services,
    delays: {
        TOKEN_EXPIRES: ({ expiresIn }) => {
            const expiry = Number((expiresIn !== null && expiresIn !== void 0 ? expiresIn : 3600) * 1000);
            return expiry;
        },
    },
    guards: {
        hasReachMaxAuthenticationAttempts: ({ authenticationAttempts = 0, maxAuthenticationAttempts = 3, }) => !!(authenticationAttempts < maxAuthenticationAttempts),
        userIsNotAuthenticated: ({ isAuthenticated }) => {
            return !isAuthenticated ? true : false;
        },
        shouldWaitForUserAction: ({ waitForUserAction = false }) => {
            return !!waitForUserAction;
        },
        hasParamater: ({ instanceGuid: i, signatoryGuid: s, claimCode: c }) => {
            return Boolean(c || i || s);
        },
        hasParamaterViaEvent: ({ instanceGuid, signatoryGuid, claimCode, anonymousLogin }, { payload }) => {
            const { instanceGuid: eventInstanceGuid, signatoryGuid: eventSignatoryGuid, claimCode: eventClaimCode, anonymousLogin: eventAnonymousLogin, } = payload;
            const i = instanceGuid || eventInstanceGuid;
            const s = signatoryGuid || eventSignatoryGuid;
            const c = claimCode || eventClaimCode;
            const a = anonymousLogin || eventAnonymousLogin;
            return Boolean(i || s || c || a || !a);
        },
        // hasParamaterAndAnonymousLoginDisabled: ({
        //   instanceGuid,
        //   signatoryGuid,
        //   claimCode,
        //   anonymousLogin,
        // }) =>
        //   Boolean(instanceGuid || signatoryGuid || claimCode) || !anonymousLogin,
        hasParamaterAndHasClaimCode: ({ instanceGuid, signatoryGuid, claimCode }) => Boolean(instanceGuid || signatoryGuid) && Boolean(claimCode),
        isInstanceGuid: ({ instanceGuid }) => Boolean(instanceGuid),
        isSignatoryGuid: ({ signatoryGuid }) => Boolean(signatoryGuid),
        hasClaimCode: ({ claimCode }) => Boolean(claimCode),
        anonymousLoginEnabled: ({ anonymousLogin }) => !!anonymousLogin,
        isAuthorized: ({ isAuthorized = false, isAuthenticated = false }) => {
            return Boolean(isAuthorized && !isAuthenticated);
        },
        isNotAuthenticated: ({ isAuthorized = false, isAuthenticated = false }) => {
            return Boolean(!isAuthenticated);
        },
        unauthenticated: (_, __, { state }) => !(state === null || state === void 0 ? void 0 : state.matches("authenticated")),
        oidcDisabledForTesting: () => {
            return Boolean(REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING);
        },
    },
};
