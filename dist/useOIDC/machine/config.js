"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    id: 'oidc',
    initial: 'authorization',
    on: {
        START_AUTH: {
            target: 'authorization',
        },
        EMTPY_OUT_LOCAL_STORAGE: {
            target: 'localStorage',
        },
    },
    states: {
        authorization: {
            id: 'authorization',
            invoke: {
                src: 'checkAuthorization',
                id: 'check-authorization',
            },
            on: {
                AUTHORIZED: {
                    target: 'authentication',
                },
            },
        },
        authentication: {
            id: 'authentication',
            invoke: {
                src: 'checkAuthentication',
                id: 'check-authentication',
            },
            on: {
                // @ts-ignore
                REFRESH: {},
                AUTHENTICATED: {
                    actions: ['assignAuthenticationResponse'],
                    target: 'authenticated',
                },
                AUTHENTICATION_ERROR: {
                    actions: ['incrementAuthenticationAttempts'],
                    target: 'retry',
                },
                CHECK_AUTH_SUCCESS: {
                    actions: ['assignAuthResult'],
                    target: 'authenticated',
                },
            },
        },
        authenticated: {
            id: 'authenticated',
            on: {
                LOG_OUT: {
                    target: 'logOut',
                },
            },
        },
        logOut: {
            id: 'logOut',
            initial: 'accessToken',
            states: {
                accessToken: {
                    id: 'accessToken',
                    entry: ['removeAccessToken'],
                    always: {
                        target: 'identityServer',
                        cond: 'userIsNotAuthenticated',
                    },
                },
                identityServer: {
                    invoke: {
                        id: 'notify-identity-server-for-logout-event',
                        src: 'notifiyIdentityServerForlogoutEvent',
                    },
                    on: {
                        SERVER_NOTIFIED: {
                            actions: ['removeLocalStorageItems'],
                            target: '#logOutSuccess',
                        },
                    },
                },
                logOutSuccess: {
                    id: 'logOutSuccess',
                    invoke: {
                        id: 'remove-local-storage-items',
                        src: 'removeLocalStorageItems',
                    },
                    after: {
                        1000: {
                            target: '#authorization',
                        },
                    },
                },
            },
        },
        localStorage: {
            id: 'localStorage',
            invoke: {
                id: 'emptyLocalStorage',
                src: 'emptyLocalStorage',
            },
            after: {
                1000: {
                    target: '#authorization',
                },
            },
        },
        retry: {
            id: 'retry',
            after: {
                1000: {
                    target: 'authentication',
                    cond: 'hasReachMaxAuthenticationAttempts',
                },
            },
        },
    },
};
