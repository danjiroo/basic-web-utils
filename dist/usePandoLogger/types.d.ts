export declare type GColors = "primary" | "secondary" | "success" | "warning" | "danger" | "light" | "dark";
export declare type GColorWeights = "50" | "100" | "200" | "DEFAULT" | "300" | "400";
export interface Colors {
    color?: GColors;
    colorWeight?: GColorWeights;
}
export interface PandoLoggerParams extends Colors {
    name: string;
    subTitle?: string;
    body?: unknown;
}
