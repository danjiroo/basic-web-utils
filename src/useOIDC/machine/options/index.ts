import { MachineOptions } from 'xstate'

import { Context, MachineEvents } from '../types'
import { actions } from './actions'
import { services } from './services'

export const options: MachineOptions<Context, MachineEvents> = {
  actions,
  services,
  delays: {},
  guards: {
    hasReachMaxAuthenticationAttempts: ({
      authenticationAttempts = 0,
      maxAuthenticationAttempts = 3,
    }) => !!(authenticationAttempts < maxAuthenticationAttempts),
    userIsNotAuthenticated: ({ isAuthenticated }) => {
      console.log('userIsNotAuthenticated:', !!isAuthenticated)
      return !isAuthenticated ? true : false
    },
  },
}
