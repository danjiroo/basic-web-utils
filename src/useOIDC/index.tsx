/* eslint-disable react-hooks/rules-of-hooks */
import { createMachine, State, AnyEventObject, Sender } from 'xstate';
import { useInterpret, useSelector } from '@xstate/react';

import { config, options } from './machine';

import { Context } from './types';

const default_context: Context = {
  isAuthorized: false,
  isAuthenticated: false,
  isLoggedIn: false,
  accessToken: null,
  authenticationAttempts: 0,
  maxAuthenticationAttempts: 3,
};

export const spawn = <Config, Options>(config: Config, options: Options) => {
  const machineConfig = {
    ...config,
    context: {
      ...default_context,
    },
  };

  return createMachine(machineConfig, options);
};

export const useOIDC = (): [Context, Sender<AnyEventObject>] => {
  const stateDefinition = localStorage.getItem('oidc');
  const recordService = useInterpret(
    spawn(config, options),
    {
      state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
    },
    (state) => localStorage.setItem('oidc', JSON.stringify(state))
  );
  const { send } = recordService;
  const selectedState = (state: State<Context>) => {
    return state.context;
  };
  const compare = <T,>(prev: T, current: T) => prev === current;
  const user = useSelector(recordService, selectedState, compare);
  return [user, send];
};
