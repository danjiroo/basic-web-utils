/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MachineConfig } from 'xstate'

import { Context, StateSchema, MachineEvents } from './types'

export const config: MachineConfig<Context, StateSchema, MachineEvents> = {
  id: 'oidc',
  initial: 'authorization',
  on: {
    START_AUTH: {
      actions: ['logger'],
      target: 'authorization',
    },
    EMTPY_OUT_LOCAL_STORAGE: {
      target: 'localStorage',
    },
  },
  states: {
    authorization: {
      id: 'authorization',
      invoke: {
        src: 'checkAuthorization',
        id: 'check-authorization',
      },
      on: {
        AUTHORIZED: {
          target: 'authentication',
        },
      },
    },
    authentication: {
      id: 'authentication',
      invoke: {
        src: 'checkAuthentication',
        id: 'check-authentication',
      },
      on: {
        // @ts-ignore
        REFRESH: {
          actions: 'logger',
        },
        AUTHENTICATED: {
          actions: ['logger', 'assignAuthenticationResponse'],
          target: 'authenticated',
        },
        AUTHENTICATION_ERROR: {
          actions: ['incrementAuthenticationAttempts'],
          target: 'retry',
        },
        CHECK_AUTH_SUCCESS: {
          actions: ['assignAuthResult'],
          target: 'authenticated',
        },
      },
    },
    authenticated: {
      id: 'authenticated',
      on: {
        LOG_OUT: {
          actions: ['logger'],
          target: 'logOut',
        },
      },
    },
    logOut: {
      id: 'logOut',
      initial: 'accessToken',
      states: {
        accessToken: {
          id: 'accessToken',
          entry: ['removeAccessToken'],
          always: {
            target: 'identityServer',
            cond: 'userIsNotAuthenticated',
          },
        },
        identityServer: {
          invoke: {
            id: 'notify-identity-server-for-logout-event',
            src: 'notifiyIdentityServerForlogoutEvent',
          },
          on: {
            SERVER_NOTIFIED: {
              actions: ['logger', 'removeLocalStorageItems'],
              target: '#logOutSuccess',
            },
          },
        },
        logOutSuccess: {
          id: 'logOutSuccess',
          invoke: {
            id: 'remove-local-storage-items',
            src: 'removeLocalStorageItems',
          },
          after: {
            1000: {
              target: '#authorization',
            },
          },
        },
      },
    },
    localStorage: {
      id: 'localStorage',
      entry: ['logger'],
      invoke: {
        id: 'emptyLocalStorage',
        src: 'emptyLocalStorage',
      },
      after: {
        1000: {
          target: '#authorization',
        },
      },
    },
    retry: {
      id: 'retry',
      entry: ['logger'],
      after: {
        1000: {
          target: 'authentication',
          cond: 'hasReachMaxAuthenticationAttempts',
        },
      },
    },
  },
}
