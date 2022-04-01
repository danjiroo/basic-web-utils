import { AnyStateNodeDefinition, StateNodeDefinition } from 'xstate';
import { Context, MachineEvents } from '..';
export declare type State = StateNodeDefinition<Context, AnyStateNodeDefinition, MachineEvents>;
export interface StateSchema {
    states: {
        authorization: State;
        authentication: State;
        authenticated: State;
        logOutSuccess: State;
        logOut: State;
        retry: State;
    };
}
