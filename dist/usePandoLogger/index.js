"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pandoLogger = void 0;
const pandoLogger = ({ name, subTitle, color = "primary", colorWeight = "DEFAULT", body, }) => {
    // color: ${colors[color][colorWeight]};
    // border: 1px solid ${colors[color][colorWeight]};
    // color: ${colors[color][200]};
    console.log(`%c${name}`, `font-weight: bold;
     font-size: 20px;
     padding: 5px;
     margin: 10px 0 ${subTitle ? "0" : "10px"};
    `, subTitle ? "" : body);
    subTitle &&
        console.log(`%c${subTitle}`, `font-weight: bold;
     font-size: 10px;
     margin: 0 0 10px;
    `, body !== null && body !== void 0 ? body : "");
};
exports.pandoLogger = pandoLogger;
