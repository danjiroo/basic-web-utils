import { AnyEventObject, Sender } from 'xstate';
import { Context } from './machine';
export declare const spawn: <Config, Options>(config: Config, options: Options) => import("xstate").StateMachine<{
    accessToken?: string | null | undefined;
    expiresIn?: null | undefined;
    idToken?: string | null | undefined;
    issuedAt?: number | null | undefined;
    refreshToken?: string | null | undefined;
    scope?: string | null | undefined;
    tokenType?: string | null | undefined;
    isAuthenticated?: boolean | undefined;
    authenticationAttempts?: number | undefined;
    maxAuthenticationAttempts?: 3 | undefined;
}, any, AnyEventObject, {
    value: any;
    context: {
        accessToken?: string | null | undefined;
        expiresIn?: null | undefined;
        idToken?: string | null | undefined;
        issuedAt?: number | null | undefined;
        refreshToken?: string | null | undefined;
        scope?: string | null | undefined;
        tokenType?: string | null | undefined;
        isAuthenticated?: boolean | undefined;
        authenticationAttempts?: number | undefined;
        maxAuthenticationAttempts?: 3 | undefined;
    };
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").TypegenDisabled & {
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
} & {
    eventsCausingActions: Record<string, string>;
    eventsCausingDelays: Record<string, string>;
    eventsCausingGuards: Record<string, string>;
    eventsCausingServices: Record<string, string>;
} & {
    indexedActions: import("xstate").IndexByType<import("xstate").BaseActionObject>;
    indexedEvents: Record<string, AnyEventObject> & {
        __XSTATE_ALLOW_ANY_INVOKE_DATA_HACK__: {
            data: any;
        };
    };
    invokeSrcNameMap: Record<string, "__XSTATE_ALLOW_ANY_INVOKE_DATA_HACK__">;
}>;
export declare const useOIDC: () => [Context, Sender<AnyEventObject>];
