"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOIDC = exports.spawn = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
const xstate_1 = require("xstate");
const react_1 = require("@xstate/react");
const react_2 = require("react");
const machine_1 = require("./machine");
const usePandoLogger_1 = require("../usePandoLogger");
const { REACT_APP_REDIRECT_URI } = process.env;
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
const useOIDC = () => {
    const stateDefinition = typeof window !== 'undefined' ? localStorage.getItem('oidc') : undefined;
    const noId = `idless-machine-${new Date().toLocaleTimeString()}`;
    const recordService = (0, react_1.useInterpret)((0, exports.spawn)(machine_1.config, machine_1.options), {
        state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
        actions: Object.assign(Object.assign({}, machine_1.options.actions), { logger: (context, event, { state }) => {
                var _a;
                return (0, usePandoLogger_1.pandoLogger)({
                    name: ((_a = machine_1.config === null || machine_1.config === void 0 ? void 0 : machine_1.config.id) !== null && _a !== void 0 ? _a : noId).toUpperCase(),
                    subTitle: event.type,
                    body: { context, event, currentState: state.value },
                });
            } }),
    }, 
    //ENSURES THAT LOCAL STORAGE WILL BE EMPTY AFTER LOGGING OUT
    (state) => {
        if (state && !state.matches('logOut'))
            typeof window !== 'undefined' &&
                localStorage.setItem('oidc', JSON.stringify(state));
    });
    const { send } = recordService;
    const selectedState = (state) => state.context;
    const compare = (prev, current) => prev === current;
    const user = (0, react_1.useSelector)(recordService, selectedState, compare);
    const URL = typeof window !== 'undefined' ? window.location.href : '';
    (0, react_2.useEffect)(() => {
        if (URL === `${REACT_APP_REDIRECT_URI}/` && !user.isAuthenticated) {
            send('EMTPY_OUT_LOCAL_STORAGE');
        }
    }, [user]);
    (0, react_2.useEffect)(() => {
        if (URL !== `${REACT_APP_REDIRECT_URI}/` && !user.isAuthenticated) {
            send('REFRESH');
        }
    }, [user]);
    // useEffect(() => {
    //   window.addEventListener('storage', (e) => {
    //     if (e.key === 'oidc' && e.oldValue && !e.newValue) {
    //       const res = localStorage.getItem('oidc')
    //       const data = res ? JSON.parse(res) : undefined
    //     }
    //   })
    // }, [user])
    return [user, send];
};
exports.useOIDC = useOIDC;
