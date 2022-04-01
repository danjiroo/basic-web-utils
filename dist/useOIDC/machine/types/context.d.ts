export interface Context {
    accessToken?: string | null;
    expiresIn?: null;
    idToken?: string | null;
    issuedAt?: number | null;
    refreshToken?: string | null;
    scope?: string | null;
    tokenType?: string | null;
    isAuthenticated?: boolean;
    authenticationAttempts?: number;
    maxAuthenticationAttempts?: 3;
}
