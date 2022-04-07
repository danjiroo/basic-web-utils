"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const actions_1 = require("./actions");
const services_1 = require("./services");
exports.options = {
    actions: actions_1.actions,
    services: services_1.services,
    delays: {},
    guards: {
        hasReachMaxAuthenticationAttempts: ({ authenticationAttempts = 0, maxAuthenticationAttempts = 3, }) => !!(authenticationAttempts < maxAuthenticationAttempts),
        userIsNotAuthenticated: ({ isAuthenticated }) => {
            console.log('userIsNotAuthenticated:', !!isAuthenticated);
            return !isAuthenticated ? true : false;
        },
    },
};
