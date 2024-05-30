"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIndexedDB = void 0;
const idb_keyval_1 = require("idb-keyval");
const useIndexedDB = (params) => {
    const { dbName = 'LocalDB' } = params;
    const store = (0, idb_keyval_1.createStore)(dbName, `${dbName}Store`);
    const getKey = (key) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, idb_keyval_1.get)(key, store); });
    const setKey = (key, data) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, idb_keyval_1.set)(key, data, store); });
    return {
        getKey,
        setKey,
    };
};
exports.useIndexedDB = useIndexedDB;
