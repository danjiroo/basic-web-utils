"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable indent */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const axios_1 = __importDefault(require("axios"));
const appauth_1 = require("@openid/appauth");
const noHashQueryStringUtils_1 = require("../../noHashQueryStringUtils");
const utils_1 = require("../../utils");
const { 
// REACT_APP_LOGIN_URI = 'https://login.staging.pandolink.com',
REACT_APP_AUTH_SERVER = 'https://login.staging.pandolink.com', REACT_APP_AUTH_SERVER_LOGOUT = 'https://login.staging.pandolink.com/connect/endsession', REACT_APP_REDIRECT_URI = 'http://localhost:3000', REACT_APP_SCOPE = '', REACT_APP_CLIENT_SECRET = 'wbtCpQYNhYcogScfRcZDAMzMYsfKcRzpEvB', REACT_APP_CLIENT_ID = '81CD8602-3B16-4AD6-81EC-89D6B9465F80', } = process.env;
const authorizationHandler = typeof window !== 'undefined'
    ? new appauth_1.RedirectRequestHandler(new appauth_1.LocalStorageBackend(), new noHashQueryStringUtils_1.NoHashQueryStringUtils(), window.location, new appauth_1.DefaultCrypto())
    : undefined;
exports.services = {
    checkAuthorization: ({ accessToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        if (!accessToken) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    appauth_1.AuthorizationServiceConfiguration.fetchFromIssuer(REACT_APP_AUTH_SERVER, new appauth_1.FetchRequestor()).then((response) => {
                        const authRequest = new appauth_1.AuthorizationRequest({
                            client_id: REACT_APP_CLIENT_ID,
                            redirect_uri: REACT_APP_REDIRECT_URI,
                            scope: REACT_APP_SCOPE,
                            response_type: appauth_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
                            state: undefined,
                            extras: {
                                client_secret: REACT_APP_CLIENT_SECRET,
                                login_code: '',
                                user_id: '',
                                event_id: '',
                                // login_code_type: 'accord_survey',
                                prompt: 'login',
                                access_type: 'offline',
                            },
                        });
                        authorizationHandler &&
                            authorizationHandler.performAuthorizationRequest(response, authRequest);
                        response && send('AUTHORIZED');
                    });
                }
                catch (error) {
                    console.log('ERROR AUTHORIZING:', error);
                }
            }))();
        }
    }),
    checkAuthentication: () => (send) => {
        (() => {
            const tokenHandler = new appauth_1.BaseTokenRequestHandler(new appauth_1.FetchRequestor());
            const notifier = new appauth_1.AuthorizationNotifier();
            authorizationHandler &&
                authorizationHandler.setAuthorizationNotifier(notifier);
            notifier.setAuthorizationListener((request, response, error) => {
                if (error)
                    console.log('SET AUTHORIZATION LISTENER ERROR', error);
                //  CREATE TOKEN REQUEST
                const requestToken = new appauth_1.TokenRequest({
                    client_id: REACT_APP_CLIENT_ID,
                    redirect_uri: REACT_APP_REDIRECT_URI,
                    grant_type: appauth_1.GRANT_TYPE_AUTHORIZATION_CODE,
                    code: response === null || response === void 0 ? void 0 : response.code,
                    refresh_token: undefined,
                    extras: request && request.internal
                        ? Object.assign(Object.assign({}, request.internal), { client_secret: REACT_APP_CLIENT_SECRET, scope: REACT_APP_SCOPE }) : {},
                });
                appauth_1.AuthorizationServiceConfiguration.fetchFromIssuer(REACT_APP_AUTH_SERVER, new appauth_1.FetchRequestor())
                    .then((response) => tokenHandler.performTokenRequest(response, requestToken))
                    .then((response) => {
                    console.log('HAHAHAHA:', response);
                    const { accessToken } = response;
                    accessToken &&
                        send({
                            type: 'AUTHENTICATED',
                            payload: Object.assign(Object.assign({}, response), { isAuthenticated: true }),
                        });
                })
                    .catch((error) => {
                    send({ type: 'AUTHENTICATION_ERROR', payload: error });
                });
            });
            authorizationHandler &&
                authorizationHandler.completeAuthorizationRequestIfPossible();
        })();
    },
    logOutUser: ({ idToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = (0, utils_1.convertToQueryParams)({
            id_token_hint: idToken,
            post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
        });
        const { data } = yield axios_1.default.get(`${REACT_APP_AUTH_SERVER_LOGOUT}${queryParams}`);
        // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
        if (data) {
            console.log('DATA DATA:', data);
            send({
                type: 'LOG_OUT_SUCCESS',
            });
        }
    }),
    notifiyIdentityServerForlogoutEvent: ({ idToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = (0, utils_1.convertToQueryParams)({
            id_token_hint: idToken,
            post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
        });
        const { data } = yield axios_1.default.get(`${REACT_APP_AUTH_SERVER_LOGOUT}${queryParams}`);
        // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
        if (data) {
            console.log('DATA DATA:', data);
            send({
                type: 'SERVER_NOTIFIED',
            });
        }
    }),
    removeLocalStorageItems: () => {
        try {
            localStorage.removeItem('oidc');
            localStorage.clear();
        }
        catch (e) {
            console.log('ERROR REMOVING LOCAL STORAGE');
        }
    },
    emptyLocalStorage: () => {
        try {
            localStorage.removeItem('oidc');
            localStorage.clear();
        }
        catch (e) {
            console.log('ERROR EMPTYING LOCAL STORAGE');
        }
    },
};
