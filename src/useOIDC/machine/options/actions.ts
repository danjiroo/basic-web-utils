/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionMap, assign } from 'xstate'

import { Context, MachineEvents } from '../types'

export const actions: ActionFunctionMap<Context, MachineEvents> = {
  assignAuthorizationResults: assign({
    isAuthorized: (_, { payload }: any) => payload.isAuthoriized,
    isLoggedIn: (_, { payload }: any) => payload.isLoggedIn,
  }),

  assignAccessToken: assign({
    accessToken: (_, { payload }: any) => payload.accessToken,
    isAuthenticated: (_, { payload }: any) => payload.isAuthenticated,
  }),

  incrementAuthenticationAttempts: assign({
    authenticationAttempts: ({ authenticationAttempts }) =>
      authenticationAttempts + 1,
  }),
}
