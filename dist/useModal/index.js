"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModal = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
const react_modal_1 = __importDefault(require("react-modal"));
react_modal_1.default.setAppElement("#root");
react_modal_1.default.defaultStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
    },
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100%",
    },
};
const useModal = () => {
    const [modalIsOpen, setIsOpen] = (0, react_1.useState)(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    return { openModal, closeModal, modalIsOpen, Modal: react_modal_1.default };
};
exports.useModal = useModal;
