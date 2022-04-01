export interface CheckAuthSuccess {
  type: 'CHECK_AUTH_SUCCESS'
  payload: {
    isAuthenticated: boolean
    accessToken: string
  }
}

export interface AuthenticatedEvent {
  type: 'AUTHENTICATED'
}

export interface CheckAuthSuccess {
  type: 'CHECK_AUTH_SUCCESS'
  payload: {
    isAuthenticated: boolean
    accessToken: string
  }
}

export interface AuthorizedEvent {
  type: 'AUTHORIZED'
}

export interface AuthenticationError {
  type: 'AUTHENTICATION_ERROR'
  payload: any
}

export interface StartAuth {
  type: 'START_AUTH'
}

export interface Logout {
  type: 'LOG_OUT'
}

export interface Loggedout {
  type: 'LOG_OUT_SUCCESS'
}
export type MachineEvents =
  | AuthorizedEvent
  | StartAuth
  | AuthenticationError
  | CheckAuthSuccess
  | AuthenticatedEvent
  | Logout
  | Loggedout
