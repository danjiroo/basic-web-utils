import { MachineConfig } from 'xstate';

import { Context, StateSchema, MachineEvents } from './types';

export const config: MachineConfig<Context, StateSchema, MachineEvents> = {
  id: 'oidc',
  initial: 'authorization',
  on: {
    START_AUTH: {
      actions: ['logger'],
      target: 'authorization',
    },
  },
  states: {
    authorization: {
      entry: ['logger'],
      id: 'authorization',
      invoke: {
        src: 'checkAuthorization',
        id: 'check-authorization',
      },
      on: {
        AUTHORIZED: {
          actions: ['assignAuthorizationResults'],
          target: 'authentication',
        },
      },
    },
    authentication: {
      entry: ['logger'],
      id: 'authentication',
      invoke: {
        src: 'checkAuthentication',
        id: 'check-authentication',
      },
      on: {
        AUTHENTICATED: {
          actions: ['logger', 'assignAccessToken'],
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
      entry: ['logger'],
      on: {
        LOG_OUT: {
          actions: [''],
          target: 'logOut',
        },
        LOG_OUT_SUCCESS: {
          actions: [''],
          target: 'authorization',
        },
      },
    },
    logOut: {
      id: 'logOut',
      invoke: {
        id: 'log-out-user',
        src: 'logOutUser',
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
};
