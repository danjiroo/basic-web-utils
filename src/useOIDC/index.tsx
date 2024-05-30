/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createMachine, State } from "xstate";
import { useInterpret, useSelector } from "@xstate/react";

import { usePandoLogger } from "../";

import { config, options, Context, ConfigParams } from "./machine";
import { ExposedActions } from "./types";

export * from "./types";
export * from "./machine";

// const { REACT_APP_REDIRECT_URI } = process.env

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

export const useOIDC = (
  params?: ConfigParams
): [State<Context>, ExposedActions, boolean] => {
  // const location = useLocation();
  const navigate = useHistory();

  const { instanceGuid, signatoryGuid, claimCode, anonymousLogin } =
    params ?? {};

  const [hasTokenExpired, setHasTokenExpired] = useState<boolean>(false);

  const stateDefinition =
    typeof window !== "undefined" ? localStorage.getItem("oidc") : undefined;

  const noId = `idless-machine-${new Date().toLocaleTimeString()}`;

  const recordService = useInterpret(
    spawn(config, options),
    {
      state: stateDefinition ? JSON.parse(stateDefinition) : undefined,
      context: {
        ...default_context,
        ...params,
        waitForUserAction: params?.waitForUserAction
          ? params?.waitForUserAction
          : false,
      },
      actions: {
        ...options.actions,
        logger: (context, event, { state }) =>
          usePandoLogger({
            name: (config?.id ?? noId).toUpperCase(),
            subTitle: event.type,
            body: { context, event, currentState: state.value },
          }),
      },
    },
    //ENSURES THAT LOCAL STORAGE WILL BE EMPTY AFTER LOGGING OUT
    (state) => {
      if (!state) return;

      if (state.matches("token_expired")) {
        setHasTokenExpired(true);
      }

      if (state.matches("authenticated")) {
        setHasTokenExpired(false);
      }

      if (!state.matches("logOut"))
        typeof window !== "undefined" &&
          localStorage.setItem("oidc", JSON.stringify(state));
    }
  );

  const { send } = recordService;

  const selectedState = (state: State<Context>) => state;
  const compare = <T,>(prev: T, current: T) => prev === current;
  const state = useSelector(recordService, selectedState, compare);

  // const URL = typeof window !== 'undefined' ? window.location.href : ''
  // const search = useLocation()?.search;
  // const instanceGuid = new URLSearchParams(search)?.get("instance_guid");
  // const signatoryGuid = new URLSearchParams(search)?.get("signatory_guid");
  // const claimCode = new URLSearchParams(search)?.get("claim_code");
  // const anonymousLogin = new URLSearchParams(search)?.get("allow_anonymous");
  const urlParams = [instanceGuid, signatoryGuid, claimCode, anonymousLogin];

  // useEffect(() => {
  //   if (
  //     URL === `${REACT_APP_REDIRECT_URI}/` &&
  //     !state?.context.isAuthenticated
  //   ) {
  //     send('EMTPY_OUT_LOCAL_STORAGE')
  //   }
  // }, [state])

  // useEffect(() => {
  //   if (search?.includes('code')) return

  //   send('RESTART')
  // }, [])

  // useEffect(() => {
  //   send('START_MACHINE')
  // }, [])

  useEffect(() => {
    if (urlParams.some((params) => params)) {
      send({
        type: "GOT_NEW_PARAMS",
        payload: {
          instanceGuid: instanceGuid ?? "",
          signatoryGuid: signatoryGuid ?? "",
          claimCode: claimCode ?? "",
          anonymousLogin: anonymousLogin ?? false,
        },
      });
    }
  }, [urlParams.some((params) => params)]);

  const exposedActions: ExposedActions = {
    handleKeepMeSignedIn: () => {
      send("KEEP_ME_SIGNED_IN");
    },
    handleLogout: () => {
      navigate.push("/");
      send("LOG_OUT");
    },
    handleLogin: () => {
      send("LOGIN_USER");
    },
    handleLoginAsGuest: () => {
      send("LOGIN_AS_GUEST");
    },
    handleTokenExpired: () => {
      send("TOKEN_EXPIRED");
    },
    handleReAuthorize: () => {
      send("REAUTHORIZE");
    },
  };

  return [state, exposedActions, hasTokenExpired];
};
