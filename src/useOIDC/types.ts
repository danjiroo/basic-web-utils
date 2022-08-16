export interface UpdateURLParams {
  instanceGuid?: string
  signatoryGuid?: string
  claimCode?: string
  anonymousLogin?: boolean
}

export interface ExposedActions {
  handleKeepMeSignedIn: () => void
  handleLogout: () => void
  handleLogin: () => void
  handleLoginAsGuest: () => void
  handleTokenExpired: () => void
  handleReAuthorize: () => void
}
