"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
const useDebounce = ({ input, actions_type, send }) => {
    const value = (0, react_1.useRef)({});
    (0, react_1.useEffect)(() => {
        value.current = Object.assign(Object.assign({}, value.current), input);
    }, [input]);
    (0, react_1.useEffect)(() => {
        const timeout = setTimeout(() => {
            send({
                type: actions_type,
                payload: value.current,
            });
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [value.current]);
};
exports.useDebounce = useDebounce;
