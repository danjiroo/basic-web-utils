export interface Context {
    accessToken?: string | null;
    expiresIn?: null;
    idToken?: string | null;
    issuedAt?: number | null;
    refreshToken?: string | null;
    scope?: string | null;
    tokenType?: string | null;
    isAuthenticated?: boolean;
    isAuthorized?: boolean;
    authenticationAttempts?: number;
    maxAuthenticationAttempts?: 3;
    waitForUserAction?: boolean;
    instanceGuid?: string;
    signatoryGuid?: string;
    claimCode?: string;
    anonymousLogin?: boolean;
    loggedInAsGuest?: boolean;
}
export interface ConfigParams {
    waitForUserAction?: boolean;
    instanceGuid?: string;
    signatoryGuid?: string;
    claimCode?: string;
    anonymousLogin?: boolean;
}
