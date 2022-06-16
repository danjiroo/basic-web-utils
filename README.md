# <h1 style="color: #1abc9c; font-weight: bold; letter-spacing: 5px; text-transform: lowercase;">USE OIDC</h1>

**useIDC** is a client side SDK that establishes communication between Open ID Connect Identity Server. This library is designed for Web Apps and Node.js applications. useOIDC adheres to PCKE extension to OAuth which facilitates secure authorization code in public clients.

## Import useOIDC to an existing project

```
yarn add @pandolink/utils
```

or

```
npm install @pandolink/utils
```

## Update Environment Variables

```javascript
    REACT_APP_AUTH_SERVER = 'https://login.staging.yourcompany.com',
    REACT_APP_REDIRECT_URI = 'https://yourcompany.com/sample',
    REACT_APP_LOGOUT_ENDPOINT = '/connect/endsession',
    REACT_APP_SCOPE = 'Add_Identity_Server_Scopes_Here',
    REACT_APP_ADMIN_CLIENT_SECRET = 'Add_Client_Secret_Here',
    REACT_APP_ADMIN_CLIENT_ID = 'Add_Client_ID_Here',
```

## How to use the hook?

```javascript
import { useOIDC } from '@pandolink/utils';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'

const App: React.FC = () => {
    const navigate = useHistory()
    const location = useLocation()

    const [state, actions, hasTokenExpired] = useOIDC({
        waitForUserAction: true,
    })

    if (!state) return null

    const { isAuthenticated } = state?.context ?? {}

    useEffect(() => {
        if (isAuthenticated && location?.search.includes('code')) {
        navigate.push('/home')
        }
    }, [isAuthenticated])

    const showLandingPage = state.matches?.('wait_for_user_interaction')

    return (
       <SWitch>
          <Route path='*'>
            {isAuthenticated ? (
            <YourHomeComponent />
            ) : showLandingPage ? (
            <YourLandingPage />
            ) : (
            <LoaderComponent />
            )}
          </Route>
       </Switch>
    );

}
```

Add this to your top level component, **react-router-dom** is optional. You can still conditionally render your components without this. This is only used in a project that conditionally render components by routes. 

The **useEffect** above is required because after getting the access token, a code is appended to the url. And this effect is executed to remove the appended code from the url.


### useOIDC Returned Data
- **state**
- **actions**
- **hasTokenExpired**

| Name  | Type | Description |
| ------------- | ------------- | ------------- |
| **state**  | StateNode  | Contains whole state node of the hook such as the **context** where the *accessToken*, *refreshToken*, etc are located. This is still subject to change, only **state.context** will be  provided instead of the entire state object. |
| **actions**  | ExposedActions  | The exposed actions from the hook. Check list below. |
| **hasTokenExpired**  | boolean  | To check if the token has already expired, and perform the logic in your other components.  |

### Exposed Actions

- handleKeepMeSignedIn
- handleLogout
- handleLogin
- handleLoginAsGuest
- handleTokenExpired


### useOIDC Paramaters


| Parameter  | Required | Type | Description |
| ------------- | ------------- | ------------- | ------------- |
| **waitForUserAction**  | *optional* | boolean  | When enabled, doesn't skip the landing page and waits for the user to execute the Login manually before redirecting to the identity server login page. ***default: false*** |
| **instanceGuid**  | *optional* | string  | An instanceGuid from the url parameters, this is only used in survey and esign executions.  |
| **signatoryGuid**  | *optional* | string  | A signatoryGuid from the url parameters, this is only used in survey and esign executions.  |
| **claimCode**  | *optional* | string  | A claimCode from the url parameters, this is only used in survey and esign executions.  |
| **anonymousLogin**  | *optional* | boolean  | An anonymousLogin from the url parameters. (Partially implemented)  |

### <a href="https://lucid.app/documents/embeddedchart/46fb8887-3f64-4701-a6e6-b6d61321276e" target="_blank">View flow diagram here</a>

useOIDC performs authorization, authentication and request an access token for your react application.

## 1: AUTHORIZATION

It will first check if you have an access token.
If access token does not exist then it will start the Open Id Connection flow.

## 2: REDIRECT

Your application will be redirected to the url you provided in the REACT_APP_LOGIN_URI env. If login credentials is correct then you'll be authorize in a code will be return in the url.

## 3: GET ACCESS TOKEN

To request for an access token, that code will then be taken by useOIDC and use it to authenticate you. If authenticated the Open ID Identity server will return an acceess token.

Use that access token to to request for data from the GRPC server.
