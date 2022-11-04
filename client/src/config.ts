// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ek0g5budwe'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-cuq3c69m.us.auth0.com',            // Auth0 domain
  clientId: '2NxVv4jG9MkjsjFHnmYInwL0i4hG5orW',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
