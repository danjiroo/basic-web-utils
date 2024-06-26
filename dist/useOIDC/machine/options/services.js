"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const __1 = require("../../../");
const index_1 = require("../../utils/index");
const { REACT_APP_AUTH_SERVER = "https://login.staging.pandolink.com", REACT_APP_LOGOUT_ENDPOINT = "/connect/endsession", REACT_APP_REDIRECT_URI = "http://localhost:3000", REACT_APP_SCOPE = "", REACT_APP_ADMIN_CLIENT_SECRET = "", REACT_APP_ADMIN_CLIENT_ID = "", } = process.env;
exports.services = {
    checkAuthorization: ({ accessToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthorizationServiceConfiguration, AuthorizationRequest, LocalStorageBackend, FetchRequestor, DefaultCrypto, RedirectRequestHandler, } = typeof window !== "undefined"
            ? yield Promise.resolve().then(() => __importStar(require("@openid/appauth")))
            : {};
        const authorizationHandler = new RedirectRequestHandler(new LocalStorageBackend(), new index_1.NoHashQueryString(), window.location, new DefaultCrypto());
        if (!accessToken) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    AuthorizationServiceConfiguration.fetchFromIssuer(REACT_APP_AUTH_SERVER, new FetchRequestor()).then((response) => {
                        const authRequest = new AuthorizationRequest({
                            client_id: REACT_APP_ADMIN_CLIENT_ID,
                            redirect_uri: REACT_APP_REDIRECT_URI,
                            scope: REACT_APP_SCOPE,
                            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
                            state: undefined,
                            extras: {
                                client_secret: REACT_APP_ADMIN_CLIENT_SECRET,
                                login_code: "",
                                user_id: "",
                                event_id: "",
                                // login_code_type: 'accord_survey',
                                prompt: "login",
                                access_type: "offline",
                            },
                        });
                        authorizationHandler.performAuthorizationRequest(response, authRequest);
                        send("AUTHORIZED");
                    });
                }
                catch (error) {
                    console.error("ERROR AUTHORIZING:", error);
                }
            }))();
        }
    }),
    checkAuthentication: ({ instanceGuid = "", signatoryGuid = "", claimCode = "" }) => (send) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const { AuthorizationServiceConfiguration, LocalStorageBackend, FetchRequestor, DefaultCrypto, RedirectRequestHandler, BaseTokenRequestHandler, AuthorizationNotifier, TokenRequest, GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, } = typeof window !== "undefined"
                ? yield Promise.resolve().then(() => __importStar(require("@openid/appauth")))
                : {};
            const authorizationHandler = new RedirectRequestHandler(new LocalStorageBackend(), new index_1.NoHashQueryString(), window.location, new DefaultCrypto());
            const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
            const notifier = new AuthorizationNotifier();
            authorizationHandler.setAuthorizationNotifier(notifier);
            notifier.setAuthorizationListener((request, response, error) => {
                if (error)
                    console.error("SET AUTHORIZATION LISTENER ERROR", error);
                //  CREATE TOKEN REQUEST
                const requestToken = new TokenRequest({
                    client_id: REACT_APP_ADMIN_CLIENT_ID,
                    redirect_uri: REACT_APP_REDIRECT_URI,
                    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
                    code: response === null || response === void 0 ? void 0 : response.code,
                    refresh_token: undefined,
                    extras: request && request.internal
                        ? Object.assign(Object.assign({}, request.internal), { client_secret: REACT_APP_ADMIN_CLIENT_SECRET, scope: REACT_APP_SCOPE }) : {},
                });
                AuthorizationServiceConfiguration.fetchFromIssuer(REACT_APP_AUTH_SERVER, new FetchRequestor())
                    .then((response) => {
                    return tokenHandler.performTokenRequest(response, requestToken);
                })
                    .then((response) => __awaiter(void 0, void 0, void 0, function* () {
                    const { accessToken } = response;
                    accessToken &&
                        send({
                            type: "AUTHENTICATED",
                            payload: Object.assign(Object.assign({}, response), { isAuthenticated: true }),
                        });
                }))
                    .catch((error) => {
                    send({ type: "AUTHENTICATION_ERROR", payload: error });
                });
            });
            authorizationHandler.completeAuthorizationRequestIfPossible();
        }))();
    },
    refreshToken: ({ refreshToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tokenHandler = new appauth_1.BaseTokenRequestHandler(new appauth_1.FetchRequestor());
            let request = null;
            const authConfig = yield appauth_1.AuthorizationServiceConfiguration.fetchFromIssuer(REACT_APP_AUTH_SERVER, new appauth_1.FetchRequestor());
            request = new appauth_1.TokenRequest({
                client_id: REACT_APP_ADMIN_CLIENT_ID,
                redirect_uri: REACT_APP_REDIRECT_URI,
                grant_type: appauth_1.GRANT_TYPE_REFRESH_TOKEN,
                code: undefined,
                refresh_token: refreshToken !== null && refreshToken !== void 0 ? refreshToken : "",
                extras: {
                    client_secret: REACT_APP_ADMIN_CLIENT_SECRET,
                    scope: REACT_APP_SCOPE,
                },
            });
            const tokenResponse = yield tokenHandler.performTokenRequest(authConfig, request);
            if (tokenResponse) {
                send({
                    type: "GOT_NEW_ACCESS_TOKEN",
                    payload: tokenResponse,
                });
            }
        }
        catch (error) {
            (0, __1.usePandoLogger)({
                name: "refreshToken: error",
                color: "danger",
                body: error === null || error === void 0 ? void 0 : error.message,
            });
        }
    }),
    logOutUser: ({ idToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = (0, index_1.convertToQueryParams)({
            id_token_hint: idToken,
            post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
        });
        const { data } = yield axios_1.default.get(`${REACT_APP_AUTH_SERVER}${REACT_APP_LOGOUT_ENDPOINT}${queryParams}`);
        // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
        if (data) {
            send({
                type: "LOG_OUT_SUCCESS",
            });
        }
    }),
    notifiyIdentityServerForlogoutEvent: ({ idToken }) => (send) => __awaiter(void 0, void 0, void 0, function* () {
        const queryParams = (0, index_1.convertToQueryParams)({
            id_token_hint: idToken,
            post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
        });
        const { data } = yield axios_1.default.get(`${REACT_APP_AUTH_SERVER}${REACT_APP_LOGOUT_ENDPOINT}${queryParams}`);
        // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
        if (data) {
            send({
                type: "SERVER_NOTIFIED",
            });
        }
    }),
    removeLocalStorageItems: () => {
        try {
            localStorage.removeItem("oidc");
            localStorage.clear();
        }
        catch (e) {
            console.error("ERROR REMOVING LOCAL STORAGE");
        }
    },
    emptyLocalStorage: () => {
        try {
            localStorage.removeItem("oidc");
            localStorage.clear();
        }
        catch (e) {
            console.error("ERROR EMPTYING LOCAL STORAGE");
        }
    },
};
