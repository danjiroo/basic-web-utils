export interface CheckAuthSuccess {
  type: 'CHECK_AUTH_SUCCESS';
  payload: {
    isAuthenticated: boolean;
    accessToken: string;
  };
}

export interface AuthenticatedEvent {
  type: 'AUTHENTICATED';
}

export interface CheckAuthSuccess {
  type: 'CHECK_AUTH_SUCCESS';
  payload: {
    isAuthenticated: boolean;
    accessToken: string;
  };
}

export interface AuthorizedEvent {
  type: 'AUTHORIZED';
  payload: {
    isAuthoriized: boolean;
    isLoggedIn: boolean;
  };
}

export interface AuthenticationError {
  type: 'AUTHENTICATION_ERROR';
}

export interface StartAuth {
  type: 'START_AUTH';
}

export type MachineEvents =
  | AuthorizedEvent
  | StartAuth
  | AuthenticationError
  | CheckAuthSuccess
  | AuthenticatedEvent;
