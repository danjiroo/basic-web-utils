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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOIDC = exports.spawn = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const xstate_1 = require("xstate");
const react_2 = require("@xstate/react");
const __1 = require("../");
const machine_1 = require("./machine");
__exportStar(require("./types"), exports);
__exportStar(require("./machine"), exports);
// const { REACT_APP_REDIRECT_URI } = process.env
const default_context = {
    accessToken: null,
    expiresIn: null,
    idToken: null,
    issuedAt: null,
    refreshToken: null,
    scope: null,
    tokenType: null,
    isAuthenticated: false,
    authenticationAttempts: 0,
    maxAuthenticationAttempts: 3,
};
const spawn = (config, options) => (0, xstate_1.createMachine)(Object.assign(Object.assign({}, config), { context: Object.assign({}, default_context) }), options);
exports.spawn = spawn;
const useOIDC = (params) => {
    // const location = useLocation();
    const navigate = (0, react_router_dom_1.useHistory)();
    const { instanceGuid, signatoryGuid, claimCode, anonymousLogin } = params !== null && params !== void 0 ? params : {};
    const [hasTokenExpired, setHasTokenExpired] = (0, react_1.useState)(false);
    const stateDefinition = typeof window !== "undefined" ? localStorage.getItem("oidc") : undefined;
    const noId = `idless-machine-${new Date().toLocaleTimeString()}`;
    const recordService = (0, react_2.useInterpret)((0, exports.spawn)(machine_1.config, machine_1.options), {
        state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
        context: Object.assign(Object.assign(Object.assign({}, default_context), params), { waitForUserAction: (params === null || params === void 0 ? void 0 : params.waitForUserAction)
                ? params === null || params === void 0 ? void 0 : params.waitForUserAction
                : false }),
        actions: Object.assign(Object.assign({}, machine_1.options.actions), { logger: (context, event, { state }) => {
                var _a;
                return (0, __1.usePandoLogger)({
                    name: ((_a = machine_1.config === null || machine_1.config === void 0 ? void 0 : machine_1.config.id) !== null && _a !== void 0 ? _a : noId).toUpperCase(),
                    subTitle: event.type,
                    body: { context, event, currentState: state.value },
                });
            } }),
    }, 
    //ENSURES THAT LOCAL STORAGE WILL BE EMPTY AFTER LOGGING OUT
    (state) => {
        if (!state)
            return;
        if (state.matches("token_expired")) {
            setHasTokenExpired(true);
        }
        if (state.matches("authenticated")) {
            setHasTokenExpired(false);
        }
        if (!state.matches("logOut"))
            typeof window !== "undefined" &&
                localStorage.setItem("oidc", JSON.stringify(state));
    });
    const { send } = recordService;
    const selectedState = (state) => state;
    const compare = (prev, current) => prev === current;
    const state = (0, react_2.useSelector)(recordService, selectedState, compare);
    // const URL = typeof window !== 'undefined' ? window.location.href : ''
    // const search = useLocation()?.search;
    // const instanceGuid = new URLSearchParams(search)?.get("instance_guid");
    // const signatoryGuid = new URLSearchParams(search)?.get("signatory_guid");
    // const claimCode = new URLSearchParams(search)?.get("claim_code");
    // const anonymousLogin = new URLSearchParams(search)?.get("allow_anonymous");
    const urlParams = [instanceGuid, signatoryGuid, claimCode, anonymousLogin];
    // useEffect(() => {
    //   if (
    //     URL === `${REACT_APP_REDIRECT_URI}/` &&
    //     !state?.context.isAuthenticated
    //   ) {
    //     send('EMTPY_OUT_LOCAL_STORAGE')
    //   }
    // }, [state])
    // useEffect(() => {
    //   if (search?.includes('code')) return
    //   send('RESTART')
    // }, [])
    // useEffect(() => {
    //   send('START_MACHINE')
    // }, [])
    (0, react_1.useEffect)(() => {
        if (urlParams.some((params) => params)) {
            send({
                type: "GOT_NEW_PARAMS",
                payload: {
                    instanceGuid: instanceGuid !== null && instanceGuid !== void 0 ? instanceGuid : "",
                    signatoryGuid: signatoryGuid !== null && signatoryGuid !== void 0 ? signatoryGuid : "",
                    claimCode: claimCode !== null && claimCode !== void 0 ? claimCode : "",
                    anonymousLogin: anonymousLogin !== null && anonymousLogin !== void 0 ? anonymousLogin : false,
                },
            });
        }
    }, [urlParams.some((params) => params)]);
    const exposedActions = {
        handleKeepMeSignedIn: () => {
            send("KEEP_ME_SIGNED_IN");
        },
        handleLogout: () => {
            navigate.push("/");
            send("LOG_OUT");
        },
        handleLogin: () => {
            send("LOGIN_USER");
        },
        handleLoginAsGuest: () => {
            send("LOGIN_AS_GUEST");
        },
        handleTokenExpired: () => {
            send("TOKEN_EXPIRED");
        },
        handleReAuthorize: () => {
            send("REAUTHORIZE");
        },
    };
    return [state, exposedActions, hasTokenExpired];
};
exports.useOIDC = useOIDC;
