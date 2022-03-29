import { AnyStateNodeDefinition, StateNodeDefinition } from 'xstate'
import { Context, MachineEvents } from '..'

export interface StateSchema {
  states: {
    authorization: StateNodeDefinition<
      Context,
      AnyStateNodeDefinition,
      MachineEvents
    >
    authentication: StateNodeDefinition<
      Context,
      AnyStateNodeDefinition,
      MachineEvents
    >
    authenticated: StateNodeDefinition<
      Context,
      AnyStateNodeDefinition,
      MachineEvents
    >
    retry: StateNodeDefinition<Context, AnyStateNodeDefinition, MachineEvents>
  }
}
