import { AnyStateNodeDefinition, StateNodeDefinition } from 'xstate';
import { Context, MachineEvents } from '..';
export declare type State = StateNodeDefinition<Context, AnyStateNodeDefinition, MachineEvents>;
export declare type LogoutState = State;
export interface StateSchema {
    states: {
        authorization: State;
        authentication: State;
        authenticated: State;
        logOut: any;
        localStorage: State;
        retry: State;
    };
}
