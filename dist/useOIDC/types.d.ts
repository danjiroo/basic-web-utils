export interface Context {
    isAuthorized: boolean;
    isAuthenticated: boolean;
    accessToken: Partial<string> | null;
    authenticationAttempts: number;
    maxAuthenticationAttempts: 3;
}
