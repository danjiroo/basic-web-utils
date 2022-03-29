/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable indent */

import { Sender } from 'xstate';

import { Context, AuthorizedEvent } from '../types';

import {
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  RedirectRequestHandler,
  FetchRequestor,
  LocalStorageBackend,
  DefaultCrypto,
  BaseTokenRequestHandler,
  AuthorizationNotifier,
  TokenRequest,
  GRANT_TYPE_AUTHORIZATION_CODE,
} from '@openid/appauth';
import { NoHashQueryStringUtils } from '../../noHashQueryStringUtils';

const {
  REACT_APP_LOGIN_URI = 'https://login.staging.pandolink.com',
  REACT_APP_REDIRECT_URI = '',
  REACT_APP_SCOPE = '',
  REACT_APP_CLIENT_SECRET = '',
  REACT_APP_CLIENT_ID = '',
} = process.env;

export const services: any = {
  checkAuthorization:
    ({ accessToken }: Context) =>
    async (send: Sender<AuthorizedEvent>) => {
      const authorizationHandler = new RedirectRequestHandler(
        new LocalStorageBackend(),
        new NoHashQueryStringUtils(),
        window.location,
        new DefaultCrypto()
      );
      if (!accessToken) {
        (async () => {
          try {
            AuthorizationServiceConfiguration.fetchFromIssuer(
              REACT_APP_LOGIN_URI!,
              new FetchRequestor()
            ).then((response) => {
              const authRequest = new AuthorizationRequest({
                client_id: REACT_APP_CLIENT_ID!,
                redirect_uri: REACT_APP_REDIRECT_URI!,
                scope: REACT_APP_SCOPE!,
                response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
                state: undefined,
                extras: {
                  client_secret: REACT_APP_CLIENT_SECRET!,
                  login_code: '',
                  user_id: '',
                  event_id: '',
                  // login_code_type: 'accord_survey',
                  prompt: 'login',
                  access_type: 'offline',
                },
              });

              authorizationHandler.performAuthorizationRequest(
                response,
                authRequest
              );
              response &&
                send({
                  type: 'AUTHORIZED',
                  payload: {
                    isAuthoriized: true,
                    isLoggedIn: true,
                  },
                });
            });
          } catch (error) {
            console.log('ERROR AUTHORIZING:', error);
          }
        })();
      }
    },

  checkAuthentication: () => (send: Sender<any>) => {
    (() => {
      const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
      const authorizationHandler = new RedirectRequestHandler(
        new LocalStorageBackend(),
        new NoHashQueryStringUtils(),
        window.location,
        new DefaultCrypto()
      );
      const notifier = new AuthorizationNotifier();
      authorizationHandler.setAuthorizationNotifier(notifier);
      notifier.setAuthorizationListener((request, response, error) => {
        if (error) console.log('SET AUTHORIZATION LISTENER ERROR', error);
        //  CREATE TOKEN REQUEST
        const requestToken = new TokenRequest({
          client_id: REACT_APP_CLIENT_ID!,
          redirect_uri: REACT_APP_REDIRECT_URI!,
          grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
          code: response?.code,
          refresh_token: undefined,
          extras:
            request && request.internal
              ? {
                  ...request.internal,
                  client_secret: REACT_APP_CLIENT_SECRET!,
                  scope: REACT_APP_SCOPE!,
                }
              : {},
        });
        AuthorizationServiceConfiguration.fetchFromIssuer(
          REACT_APP_LOGIN_URI!,
          new FetchRequestor()
        )
          .then((response) => {
            const configuration = response;
            return tokenHandler.performTokenRequest(
              configuration,
              requestToken
            );
          })
          .then(({ accessToken }) => {
            send({
              type: 'AUTHENTICATED',
              payload: {
                accessToken,
                isAuthenticated: true,
              },
            });
          })
          .catch((error) => {
            send('AUTHENTICATION_ERROR');
          });
      });
      authorizationHandler.completeAuthorizationRequestIfPossible();
    })();
  },
};
