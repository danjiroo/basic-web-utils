import { AnyStateNodeDefinition, StateNodeDefinition } from "xstate";
import { Context, MachineEvents } from "..";
export declare type State = StateNodeDefinition<Context, AnyStateNodeDefinition, MachineEvents>;
export declare type LogoutState = State;
export interface StateSchema {
    states: {
        check_url_parameters: State;
        check_guid_resource: State;
        check_claim_code: State;
        check_allow_anonymous_flag: State;
        landing_page: State;
        wait_for_user_interaction: State;
        authorization: State;
        authentication: State;
        claim_resource: State;
        authenticated: State;
        token_expired: State;
        refresh_token: State;
        logOut: any;
        localStorage: State;
        retry: State;
    };
}
