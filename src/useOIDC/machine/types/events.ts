import { TokenResponse } from '@openid/appauth'

/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface GotNewAccessTokenEvent {
  type: 'GOT_NEW_ACCESS_TOKEN'
  payload: TokenResponse
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

export interface Done {
  type: 'DONE'
}

export interface ServerNotified {
  type: 'SERVER_NOTIFIED'
}

export interface EmptyLocalStorage {
  type: 'EMTPY_OUT_LOCAL_STORAGE'
}

export interface InitializeAuth {
  type: 'INITIALIZE_AUTH'
}

export interface LoginUser {
  type: 'LOGIN_USER'
}

export interface KeepMeSignedInEvent {
  type: 'KEEP_ME_SIGNED_IN'
}

export interface TokenExpiredEvent {
  type: 'TOKEN_EXPIRED'
}

export interface ClaimResourceSuccess {
  type: 'CLAIM_RESOURCE_SUCCESS'
}

export interface ClaimResourceError {
  type: 'CLAIM_RESOURCE_ERROR'
}

export interface GotNewParams {
  type: 'GOT_NEW_PARAMS'
}

export interface StartMachine {
  type: 'START_MACHINE'
}

export type MachineEvents =
  | AuthorizedEvent
  | StartAuth
  | AuthenticationError
  | CheckAuthSuccess
  | AuthenticatedEvent
  | Logout
  | Loggedout
  | Done
  | ServerNotified
  | EmptyLocalStorage
  | InitializeAuth
  | LoginUser
  | GotNewAccessTokenEvent
  | KeepMeSignedInEvent
  | TokenExpiredEvent
  | ClaimResourceSuccess
  | ClaimResourceError
  | GotNewParams
  | StartMachine
