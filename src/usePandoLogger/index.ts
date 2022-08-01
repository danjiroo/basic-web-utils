import { PandoLoggerParams } from "./types";

import { Themes } from "@pando-styles/nirvana";

const { colors } = Themes.base;

export const usePandoLogger = ({
  name,
  subTitle,
  color = "primary",
  colorWeight = "DEFAULT",
  body,
}: PandoLoggerParams) => {
  console.log(
    `%c${name}`,
    `font-weight: bold;
     font-size: 20px;
     color: ${colors[color][colorWeight]};
     border: 1px solid ${colors[color][colorWeight]};
     padding: 5px;
     margin: 10px 0 ${subTitle ? "0" : "10px"};
    `,
    subTitle ? "" : body
  );
  subTitle &&
    console.log(
      `%c${subTitle}`,
      `font-weight: bold;
     font-size: 10px;
     color: ${colors[color][200]};
     margin: 0 0 10px;
    `,
      body ?? ""
    );
};
