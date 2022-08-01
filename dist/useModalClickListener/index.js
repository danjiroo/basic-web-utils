"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const react_1 = require("react");
const useModalClickListener = ({ handleCloseModal, }) => {
    const modalRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleClick = (e) => {
            // @ts-ignore
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                handleCloseModal === null || handleCloseModal === void 0 ? void 0 : handleCloseModal();
            }
        };
        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, []);
    return { modalRef };
};
exports.default = useModalClickListener;
