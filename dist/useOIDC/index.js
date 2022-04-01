"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOIDC = exports.spawn = void 0;
/* eslint-disable react-hooks/rules-of-hooks */
const xstate_1 = require("xstate");
const react_1 = require("@xstate/react");
const machine_1 = require("./machine");
const __1 = require("../");
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
    const stateDefinition = localStorage.getItem('oidc');
    const noId = `idless-machine-${new Date().toLocaleTimeString()}`;
    const recordService = (0, react_1.useInterpret)((0, exports.spawn)(machine_1.config, machine_1.options), {
        state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
        actions: {
            // ...options.actions,
            logger: (context, event, { state }) => {
                var _a;
                return (0, __1.usePandoLogger)({
                    name: ((_a = machine_1.config === null || machine_1.config === void 0 ? void 0 : machine_1.config.id) !== null && _a !== void 0 ? _a : noId).toUpperCase(),
                    subTitle: event.type,
                    body: { context, event, currentState: state.value },
                });
            },
        },
    }, (state) => localStorage.setItem('oidc', JSON.stringify(state)));
    const { send } = recordService;
    const selectedState = (state) => state.context;
    const compare = (prev, current) => prev === current;
    const user = (0, react_1.useSelector)(recordService, selectedState, compare);
    return [user, send];
};
exports.useOIDC = useOIDC;
