# <h1 style="color: #1abc9c; font-weight: bold; letter-spacing: 5px; text-transform: lowercase;">USE OIDC</h1>

useIDC is a client side SDK that establishes communication between Open ID Connect Identity Server. This library is designed for Web Apps and Node.js applications. useOIDC adheres to PCKE extension to OAuth which facilitates secure authorization code in public clients.

## Import useOIDC to an existing project

```
yarn add @pandolink/utils
```

or

```
npm install @pandolink/utils
```

```javascript
    // Add the following env to existing react project
    // It should have a REACT_APP_ prefix
    REACT_APP_LOGIN_URI = 'https://login.staging.yourcompany.com',
    REACT_APP_REDIRECT_URI = 'https://yourcompany.com/sample',
    REACT_APP_SCOPE = 'xyz',
    REACT_APP_CLIENT_SECRET = '123xyz',
    REACT_APP_CLIENT_ID = '1234',
```

```javascript
// Top Level Component
import { useOIDC } from '@pandolink/utils';

const App: React.FC = () => {
    const [user] = useOIDC()
    return (
        <Route to='/admin'>
            {
                user.isAuthenticated && </Admin>
            }
        </Route>
    );

}
```

<div style="width: 640px; height: 480px; margin: 10px; position: relative;">
  <iframe
    allowfullscreen
    frameborder="0"
    style="width:640px; height:480px"
    src="https://lucid.app/documents/embeddedchart/46fb8887-3f64-4701-a6e6-b6d61321276e"
    id="4I576WooT62T"
  ></iframe>
</div>

useOIDC performs authorization, authentication and request an access token for your react application.

## 1: AUTHORIZATION

It will first check if you have an access token.
If access token does not exist then it will start the Open Id Connection flow.

## 2: REDIRECT

Your application will be redirected to the url you provided in the REACT_APP_LOGIN_URI env. If login credentials is correct then you'll be authorize in a code will be return in the url.

## 3: GET ACCESS TOKEN

To request for an access token, that code will then be taken by useOIDC and use it to authenticate you. If authenticated the Open ID Identity server will return an acceess token.

Use that access token to to request for data from the GRPC server.
