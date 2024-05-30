"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = exports.validatePassword = exports.validateUrl = exports.validateMinLength = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.validateEmail = validateEmail;
const validateMinLength = (valueLength, minLength) => valueLength < minLength;
exports.validateMinLength = validateMinLength;
const validateUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(url);
};
exports.validateUrl = validateUrl;
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
};
exports.validatePassword = validatePassword;
const Validate = ({ fields, fieldRules, }) => {
    var _a;
    const validatedFields = (_a = Object.values(fields !== null && fields !== void 0 ? fields : {})) === null || _a === void 0 ? void 0 : _a.reduce((acc, field) => {
        var _a;
        let currentField = Object.assign({}, field);
        const value = currentField === null || currentField === void 0 ? void 0 : currentField.value;
        const { required, isValidEmail, isValidPassword, isValidUrl, minLength } = (_a = fieldRules === null || fieldRules === void 0 ? void 0 : fieldRules[currentField.name]) !== null && _a !== void 0 ? _a : {};
        // check for required fields
        if ((required === null || required === void 0 ? void 0 : required.check) && !value) {
            currentField = Object.assign(Object.assign({}, currentField), { error: true, errorText: required === null || required === void 0 ? void 0 : required.message });
        }
        // check for valid emails
        else if ((isValidEmail === null || isValidEmail === void 0 ? void 0 : isValidEmail.check) && !(0, exports.validateEmail)(value)) {
            currentField = Object.assign(Object.assign({}, currentField), { error: true, errorText: isValidEmail === null || isValidEmail === void 0 ? void 0 : isValidEmail.message });
        }
        // check for valid urls
        else if ((isValidUrl === null || isValidUrl === void 0 ? void 0 : isValidUrl.check) && !(0, exports.validateUrl)(value)) {
            currentField = Object.assign(Object.assign({}, currentField), { error: true, errorText: isValidUrl === null || isValidUrl === void 0 ? void 0 : isValidUrl.message });
        }
        // check for valid minimum lengths
        else if ((minLength === null || minLength === void 0 ? void 0 : minLength.check) &&
            (0, exports.validateMinLength)(value.length, minLength === null || minLength === void 0 ? void 0 : minLength.check)) {
            currentField = Object.assign(Object.assign({}, currentField), { error: true, errorText: minLength === null || minLength === void 0 ? void 0 : minLength.message });
        }
        // check for valid passwords
        else if ((isValidPassword === null || isValidPassword === void 0 ? void 0 : isValidPassword.check) && !(0, exports.validatePassword)(value)) {
            currentField = Object.assign(Object.assign({}, currentField), { error: true, errorText: isValidPassword === null || isValidPassword === void 0 ? void 0 : isValidPassword.message });
        }
        return Object.assign(Object.assign({}, acc), { [currentField.name]: currentField });
    }, {});
    return validatedFields;
};
exports.Validate = Validate;
