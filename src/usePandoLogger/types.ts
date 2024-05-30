import { GlobalColors } from "@pando-styles/nirvana";

export interface PandoLoggerParams extends GlobalColors {
  name: string;
  subTitle?: string;
  body?: unknown;
}
