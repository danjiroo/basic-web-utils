import { AnyStateNodeDefinition, StateNodeDefinition } from 'xstate'
import { Context, MachineEvents } from '..'

export type State = StateNodeDefinition<
  Context,
  AnyStateNodeDefinition,
  MachineEvents
>

export type LogoutState = State
export interface StateSchema {
  states: {
    authorization: State
    authentication: State
    authenticated: State
    // logOutSuccess: State
    logOut: any
    localStorage: State
    retry: State
  }
}
