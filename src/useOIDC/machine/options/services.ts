/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable indent */
import { Sender } from "xstate";
import axios from "axios";
import {
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  FetchRequestor,
  GRANT_TYPE_REFRESH_TOKEN,
  TokenRequest,
} from "@openid/appauth";

import { usePandoLogger } from "../../../";

import { Context, AuthorizedEvent } from "../types";
import { NoHashQueryString, convertToQueryParams } from "../../utils/index";

const {
  REACT_APP_AUTH_SERVER = "https://login.staging.pandolink.com",
  REACT_APP_LOGOUT_ENDPOINT = "/connect/endsession",
  REACT_APP_REDIRECT_URI = "http://localhost:3000",
  REACT_APP_SCOPE = "",
  REACT_APP_ADMIN_CLIENT_SECRET = "",
  REACT_APP_ADMIN_CLIENT_ID = "",
} = process.env;

export const services: any = {
  checkAuthorization:
    ({ accessToken }: Context) =>
    async (send: Sender<AuthorizedEvent>) => {
      const {
        AuthorizationServiceConfiguration,
        AuthorizationRequest,
        LocalStorageBackend,
        FetchRequestor,
        DefaultCrypto,
        RedirectRequestHandler,
      } =
        typeof window !== "undefined"
          ? await import("@openid/appauth")
          : ({} as any);

      const authorizationHandler = new RedirectRequestHandler(
        new LocalStorageBackend(),
        new NoHashQueryString(),
        window.location,
        new DefaultCrypto()
      );

      if (!accessToken) {
        (async () => {
          try {
            AuthorizationServiceConfiguration.fetchFromIssuer(
              REACT_APP_AUTH_SERVER!,
              new FetchRequestor()
            ).then((response: any) => {
              const authRequest = new AuthorizationRequest({
                client_id: REACT_APP_ADMIN_CLIENT_ID,
                redirect_uri: REACT_APP_REDIRECT_URI,
                scope: REACT_APP_SCOPE,
                response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
                state: undefined,
                extras: {
                  client_secret: REACT_APP_ADMIN_CLIENT_SECRET,
                  login_code: "",
                  user_id: "",
                  event_id: "",
                  // login_code_type: 'accord_survey',
                  prompt: "login",
                  access_type: "offline",
                },
              });

              authorizationHandler.performAuthorizationRequest(
                response,
                authRequest
              );

              send("AUTHORIZED");
            });
          } catch (error) {
            console.error("ERROR AUTHORIZING:", error);
          }
        })();
      }
    },

  checkAuthentication:
    ({ instanceGuid = "", signatoryGuid = "", claimCode = "" }) =>
    (send: Sender<any>) => {
      (async () => {
        const {
          AuthorizationServiceConfiguration,
          LocalStorageBackend,
          FetchRequestor,
          DefaultCrypto,
          RedirectRequestHandler,
          BaseTokenRequestHandler,
          AuthorizationNotifier,
          TokenRequest,
          GRANT_TYPE_AUTHORIZATION_CODE,
          GRANT_TYPE_REFRESH_TOKEN,
        } =
          typeof window !== "undefined"
            ? await import("@openid/appauth")
            : ({} as any);

        const authorizationHandler = new RedirectRequestHandler(
          new LocalStorageBackend(),
          new NoHashQueryString(),
          window.location,
          new DefaultCrypto()
        );

        const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
        const notifier = new AuthorizationNotifier();
        authorizationHandler.setAuthorizationNotifier(notifier);

        notifier.setAuthorizationListener(
          (request: any, response: any, error: any) => {
            if (error) console.error("SET AUTHORIZATION LISTENER ERROR", error);
            //  CREATE TOKEN REQUEST

            const requestToken = new TokenRequest({
              client_id: REACT_APP_ADMIN_CLIENT_ID,
              redirect_uri: REACT_APP_REDIRECT_URI,
              grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
              code: response?.code,
              refresh_token: undefined,
              extras:
                request && request.internal
                  ? {
                      ...request.internal,
                      client_secret: REACT_APP_ADMIN_CLIENT_SECRET,
                      scope: REACT_APP_SCOPE,
                    }
                  : {},
            });

            AuthorizationServiceConfiguration.fetchFromIssuer(
              REACT_APP_AUTH_SERVER!,
              new FetchRequestor()
            )
              .then((response: any) => {
                return tokenHandler.performTokenRequest(response, requestToken);
              })
              .then(async (response: any) => {
                const { accessToken } = response;

                accessToken &&
                  send({
                    type: "AUTHENTICATED",
                    payload: {
                      ...response,
                      isAuthenticated: true,
                    },
                  });
              })
              .catch((error: any) => {
                send({ type: "AUTHENTICATION_ERROR", payload: error });
              });
          }
        );
        authorizationHandler.completeAuthorizationRequestIfPossible();
      })();
    },
  refreshToken:
    ({ refreshToken }: Context) =>
    async (send: Sender<any>) => {
      try {
        const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());

        let request: TokenRequest | null = null;

        const authConfig =
          await AuthorizationServiceConfiguration.fetchFromIssuer(
            REACT_APP_AUTH_SERVER,
            new FetchRequestor()
          );
        request = new TokenRequest({
          client_id: REACT_APP_ADMIN_CLIENT_ID,
          redirect_uri: REACT_APP_REDIRECT_URI,
          grant_type: GRANT_TYPE_REFRESH_TOKEN,
          code: undefined,
          refresh_token: refreshToken ?? "",
          extras: {
            client_secret: REACT_APP_ADMIN_CLIENT_SECRET,
            scope: REACT_APP_SCOPE,
          },
        });

        const tokenResponse = await tokenHandler.performTokenRequest(
          authConfig,
          request
        );

        if (tokenResponse) {
          send({
            type: "GOT_NEW_ACCESS_TOKEN",
            payload: tokenResponse,
          });
        }
      } catch (error: any) {
        usePandoLogger({
          name: "refreshToken: error",
          color: "danger",
          body: error?.message,
        });
      }
    },
  logOutUser:
    ({ idToken }: Context) =>
    async (send: Sender<any>) => {
      const queryParams = convertToQueryParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
      });
      const { data } = await axios.get(
        `${REACT_APP_AUTH_SERVER}${REACT_APP_LOGOUT_ENDPOINT}${queryParams}`
      );
      // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
      if (data) {
        send({
          type: "LOG_OUT_SUCCESS",
        });
      }
    },
  notifiyIdentityServerForlogoutEvent:
    ({ idToken }: Context) =>
    async (send: Sender<any>) => {
      const queryParams = convertToQueryParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: REACT_APP_REDIRECT_URI,
      });
      const { data } = await axios.get(
        `${REACT_APP_AUTH_SERVER}${REACT_APP_LOGOUT_ENDPOINT}${queryParams}`
      );
      // window.location.href = REACT_APP_AUTH_SERVER_LOGOUT + queryParams
      if (data) {
        send({
          type: "SERVER_NOTIFIED",
        });
      }
    },
  removeLocalStorageItems: () => {
    try {
      localStorage.removeItem("oidc");
      localStorage.clear();
    } catch (e) {
      console.error("ERROR REMOVING LOCAL STORAGE");
    }
  },
  emptyLocalStorage: () => {
    try {
      localStorage.removeItem("oidc");
      localStorage.clear();
    } catch (e) {
      console.error("ERROR EMPTYING LOCAL STORAGE");
    }
  },
};
