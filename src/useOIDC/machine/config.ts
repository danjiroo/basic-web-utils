/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MachineConfig } from 'xstate'

import { Context, StateSchema, MachineEvents } from './types'

export const config: MachineConfig<Context, StateSchema, MachineEvents> = {
  id: 'oidc',
  initial: 'check_url_parameters',
  on: {
    EMTPY_OUT_LOCAL_STORAGE: {
      target: 'localStorage',
    },
    TOKEN_EXPIRED: {
      target: '#token_expired',
    },
    GOT_NEW_PARAMS: {
      cond: 'unauthenticated',
      actions: ['updateUrlParams'],
    },
  },
  states: {
    check_url_parameters: {
      id: 'check_url_parameters',
      // on: {
      //   START_MACHINE: [
      //     {
      //       cond: 'oidcDisabledForTesting',
      //       actions: 'assignManuallyFetchedAccessToken',
      //       target: 'authenticated',
      //     },
      //     {
      //       cond: 'hasParamater',
      //       target: 'check_guid_resource',
      //     },
      //     {
      //       target: 'authorization',
      //     },
      //   ],
      // },
      always: [
        {
          cond: 'oidcDisabledForTesting',
          actions: 'assignManuallyFetchedAccessToken',
          target: 'authenticated',
        },
        {
          cond: 'hasParamater',
          target: 'check_guid_resource',
        },
        {
          target: 'authorization',
        },
      ],
    },
    check_guid_resource: {
      id: 'check_guid_resource',
      always: [
        {
          cond: 'isInstanceGuid',
          target: 'check_claim_code',
        },
        {
          cond: 'isSignatoryGuid',
          target: 'check_claim_code',
        },
        {
          target: 'authorization',
        },
      ],
    },
    check_claim_code: {
      always: [
        {
          cond: 'hasClaimCode',
          target: 'check_allow_anonymous_flag',
        },
        {
          target: 'authorization',
        },
      ],
    },
    check_allow_anonymous_flag: {
      always: [
        {
          cond: 'anonymousLoginEnabled',
          target: 'landing_page',
        },
        {
          target: 'authorization',
        },
      ],
    },
    landing_page: {
      id: 'landing_page',
      always: [
        {
          cond: 'shouldWaitForUserAction',
          target: 'wait_for_user_interaction',
        },
        {
          target: 'authorization',
        },
      ],
    },
    wait_for_user_interaction: {
      on: {
        LOGIN_USER: {
          target: 'authorization',
        },
        // @ts-ignore
        LOGIN_AS_GUEST: {
          actions: ['assignLoggedInAsGuest'],
          // temporary for now, since no anonymous login
          // credentials given yet
          target: 'authorization',
        },
        GOT_NEW_PARAMS: [
          {
            cond: 'hasParamaterViaEvent',
            target: 'check_guid_resource',
            actions: ['updateUrlParams'],
          },
          {
            target: 'landing_page',
            actions: ['updateUrlParams'],
          },
        ],
      },
    },
    authorization: {
      id: 'authorization',
      invoke: {
        src: 'checkAuthorization',
        id: 'check-authorization',
      },
      on: {
        AUTHORIZED: {
          actions: ['setIsAuthorizeToTrue'],
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
        GOT_NEW_PARAMS: [
          {
            cond: 'hasParamaterViaEvent',
            target: 'check_guid_resource',
            actions: ['updateUrlParams'],
          },
          {
            target: 'landing_page',
            actions: ['updateUrlParams'],
          },
        ],
        // @ts-ignore
        REAUTHORIZE: {
          target: '#check_url_parameters',
        },
        AUTHENTICATED: [
          // {
          //   cond: "hasParamaterAndHasClaimCode",
          //   actions: ["assignAuthenticationResponse"],
          //   target: "claim_resource",
          // },
          {
            actions: ['assignAuthenticationResponse'],
            target: 'authenticated',
          },
        ],
        AUTHENTICATION_ERROR: {
          actions: ['incrementAuthenticationAttempts'],
          target: 'retry',
        },
      },
    },
    authenticated: {
      id: 'authenticated',
      on: {
        LOG_OUT: {
          target: 'logOut',
        },
      },
      after: {
        TOKEN_EXPIRES: {
          actions: ['logTokenExpired'],
          target: '#token_expired',
        },
      },
    },
    token_expired: {
      id: 'token_expired',
      on: {
        KEEP_ME_SIGNED_IN: {
          target: '#refresh_token',
        },
        LOG_OUT: {
          target: 'logOut',
        },
      },
    },
    refresh_token: {
      id: 'refresh_token',
      invoke: {
        id: 'refresh-token',
        src: 'refreshToken',
      },
      on: {
        GOT_NEW_ACCESS_TOKEN: {
          actions: ['assignAuthenticationResponse'],
          target: '#authenticated',
        },
        KEEP_ME_SIGNED_IN: {
          target: '#refresh_token',
        },
        LOG_OUT: {
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
            1000: [
              {
                cond: 'oidcDisabledForTesting',
                actions: 'assignManuallyFetchedAccessToken',
                target: '#authenticated',
              },
              {
                actions: ['clearUrlParams'],
                target: '#landing_page',
              },
            ],
          },
        },
      },
    },
    localStorage: {
      id: 'localStorage',
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
      after: {
        1000: {
          target: 'authentication',
          cond: 'hasReachMaxAuthenticationAttempts',
        },
      },
    },
  },
}
