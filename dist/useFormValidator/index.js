"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const react_1 = require("react");
const validator_1 = require("./validator");
const useFormValidator = (props) => {
    const { fields, fieldRules, actions, options } = props;
    const { onChangeSideEffect, onSubmitSideEfect } = actions !== null && actions !== void 0 ? actions : {};
    const { errorOnChange = false, debounceTime = 200 } = options !== null && options !== void 0 ? options : {};
    const [isValidated, setIsValidated] = (0, react_1.useState)(false);
    const onChange = (event) => {
        const { name, value: onChangeValue } = event;
        onChangeSideEffect === null || onChangeSideEffect === void 0 ? void 0 : onChangeSideEffect(Object.assign(Object.assign({}, fields), { [name]: Object.assign(Object.assign({}, fields[name]), { value: onChangeValue, error: fields === null || fields === void 0 ? void 0 : fields.error, errorText: fields === null || fields === void 0 ? void 0 : fields.errorText }) }));
    };
    const onSubmit = () => {
        var _a, _b;
        const validatedFields = (0, validator_1.Validate)({
            fieldRules,
            fields: (_a = Object.entries(fields)) === null || _a === void 0 ? void 0 : _a.reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: Object.assign(Object.assign({}, fields === null || fields === void 0 ? void 0 : fields[key]), value) })), {}),
        });
        const hasErrors = (_b = Object.values(validatedFields !== null && validatedFields !== void 0 ? validatedFields : {})) === null || _b === void 0 ? void 0 : _b.some((field) => field === null || field === void 0 ? void 0 : field.error);
        if (hasErrors) {
            onChangeSideEffect === null || onChangeSideEffect === void 0 ? void 0 : onChangeSideEffect(Object.assign(Object.assign({}, fields), validatedFields));
            return;
        }
        onSubmitSideEfect === null || onSubmitSideEfect === void 0 ? void 0 : onSubmitSideEfect();
    };
    const validate = ({ enableSubmit = false }) => {
        var _a;
        const validatedFields = (0, validator_1.Validate)({ fieldRules, fields });
        const hasErrors = (_a = Object.values(validatedFields !== null && validatedFields !== void 0 ? validatedFields : {})) === null || _a === void 0 ? void 0 : _a.some((field) => field === null || field === void 0 ? void 0 : field.error);
        setIsValidated(enableSubmit ? enableSubmit : !hasErrors);
        return validatedFields;
    };
    let timeout;
    // Debounce errors on input change without pressing submit button
    (0, react_1.useEffect)(() => {
        if (errorOnChange) {
            const onDebouce = () => {
                const validatedFields = validate({ enableSubmit: false });
                onChangeSideEffect === null || onChangeSideEffect === void 0 ? void 0 : onChangeSideEffect(Object.assign(Object.assign({}, fields), validatedFields));
            };
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(() => onDebouce(), debounceTime);
            return () => {
                if (timeout)
                    clearTimeout(timeout);
            };
        }
        else {
            validate({ enableSubmit: true });
        }
    }, [fields]);
    const onReset = () => { };
    return {
        fields,
        onChange,
        onSubmit,
        onReset,
        isValidated,
    };
};
exports.default = useFormValidator;
