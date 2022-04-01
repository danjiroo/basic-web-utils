import { PandoLoggerParams } from './types';

export const usePandoLogger = ({ name, subTitle, body }: PandoLoggerParams) => {
  console.log(
    `%c${name}`,
    `font-weight: bold;
     font-size: 20px;
     color: #2C969B;
     border: 1px solid #2C969B;
     padding: 5px;
     margin: 10px 0 ${subTitle ? '0' : '10px'};
    `,
    subTitle ? '' : body
  );
  subTitle &&
    console.log(
      `%c${subTitle}`,
      `font-weight: bold;
     font-size: 10px;
     color: #00E59E;
     margin: 0 0 10px;
    `,
      body ?? ''
    );
};
