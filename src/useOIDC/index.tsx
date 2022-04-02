/* eslint-disable react-hooks/rules-of-hooks */
import { createMachine, State, AnyEventObject, Sender } from 'xstate';
import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { config, options } from './machine';

import { Context } from './machine';
import { usePandoLogger } from '../';
const { REACT_APP_REDIRECT_URI } = process.env;

const default_context: Context = {
  accessToken: null,
  expiresIn: null,
  idToken: null,
  issuedAt: null,
  refreshToken: null,
  scope: null,
  tokenType: null,
  isAuthenticated: false,
  authenticationAttempts: 0,
  maxAuthenticationAttempts: 3,
};

export const spawn = <Config, Options>(config: Config, options: Options) =>
  createMachine({ ...config, context: { ...default_context } }, options);

export const useOIDC = (): [Context, Sender<AnyEventObject>] => {
  const stateDefinition = localStorage.getItem('oidc');
  const noId = `idless-machine-${new Date().toLocaleTimeString()}`;
  const recordService = useInterpret(
    spawn(config, options),
    {
      state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
      actions: {
        // ...options.actions,
        logger: (context, event, { state }) =>
          usePandoLogger({
            name: (config?.id ?? noId).toUpperCase(),
            subTitle: event.type,
            body: { context, event, currentState: state.value },
          }),
      },
    },
    (state) => localStorage.setItem('oidc', JSON.stringify(state))
  );
  const { send } = recordService;
  const selectedState = (state: State<Context>) => state.context;
  const compare = <T,>(prev: T, current: T) => prev === current;
  const user = useSelector(recordService, selectedState, compare);

  const URL = window.location.href;
  useEffect(() => {
    if (URL === `${REACT_APP_REDIRECT_URI}/`) send('START_AUTH');
  }, []);
  return [user, send];
};
