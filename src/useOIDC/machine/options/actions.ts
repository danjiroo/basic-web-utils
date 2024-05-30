/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionMap, assign } from "xstate";

import { Context, MachineEvents } from "../types";

const { REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING = "" } = process.env;

export const actions: ActionFunctionMap<Context, MachineEvents> = {
  assignAuthenticationResponse: assign((context, { payload }: any) => ({
    ...context,
    ...payload,
  })),

  assignManuallyFetchedAccessToken: assign((context) => {
    return {
      accessToken: REACT_APP_ACCESS_TOKEN_FOR_DEBUGGING,
      isAuthenticated: true,
    };
  }),

  incrementAuthenticationAttempts: assign({
    authenticationAttempts: ({ authenticationAttempts = 0 }) =>
      authenticationAttempts + 1,
  }),

  removeAccessToken: assign((context) => ({
    ...context,
    isAuthenticated: false,
    accessToken: null,
  })),

  updateUrlParams: assign((context, { payload }: any) => ({
    ...context,
    ...payload,
  })),

  clearUrlParams: assign((context) => ({
    ...context,
    instanceGuid: "",
    signatoryGuid: "",
    claimCode: "",
    anonymousLogin: false,
    loggedInAsGuest: false,
  })),

  assignLoggedInAsGuest: assign((context) => ({
    ...context,
    loggedInAsGuest: true,
  })),

  setAuthorizeToTrue: assign((context) => ({
    ...context,
    isAuthorized: true,
  })),

  logTokenExpired: () => console.log("Token expired."),
};
