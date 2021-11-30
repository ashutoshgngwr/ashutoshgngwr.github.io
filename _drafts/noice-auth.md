---
image: noice-auth-0.png
layout: post
mathjax: false
title: Designing a password-less authentication system for Noice
---

![auth-flow](/assets/posts/img/noice-auth-0.png)

## Credentials

### Access Token

An access token is a short-lived JWT that expires 30 minutes after its issuance.
The backend server uses access tokens to authorise access to protected
resources. Once an access token expires, a client must request the backend
server for a new one using a refresh token.

### Refresh Token

A refresh token is a long-lived JWT that expires a week after its issuance. It
allows persistent authentication across user sessions. When an access token
expires, a client uses the refresh token to issue a new one. The backend server
extends the expiration of the refresh token with each re-use.

### Sign-in Token

A sign-in token is a special case of refresh tokens with a shorter expiration
(15 minutes).

## Sign-in and Sign-up

To sign in or sign up, clients should make requests to `/v1/accounts/signIn` and
`/v1/accounts/signUp` API endpoints respectively. For valid requests, the
backend sends a sign-in URL to the provided email address. When the user opens
the URL using a client of their choice, it must obtain the sign-in token from
the URL and exchange it with the backend server for new credentials to conclude
the sign-in flow.

## Issuing New Credentials

The backend supports two methods for issuing new credentials using a refresh
token.

### Explicit Exchange

The clients explicitly request `/v1/accounts/credentials` API endpoint with the
token in the `X-Refresh-Token` header. If the refresh token is valid, the
backend responds with a JSON object containing new refresh and access tokens.
e.g.

```json
{
  "refreshToken": "<new-refresh-jwt>",
  "accessToken": "<new-access-jwt>"
}
```

### Implicit Exchange

If a client prefers using cookies, e.g. web browsers, the backend can perform an
implicit token exchange with any API request. The client must send both refresh
and access tokens as cookies with every request to the backend server. It is the
default behaviour for browsers.

The backend first tries to authenticate the request using the access token
cookie. On failing to do it, it looks for the refresh token cookie. If the
refresh token is valid, the backend uses it to issue new credentials. It then
processes the request and appends `Set-Cookie` headers to its response.

For example, if a client requests a resource hosted at `/v1/test/resource` with
an expired access token cookie but a valid refresh token cookie, the response
will include `Set-Cookie` headers with new tokens for both cookies.

## Sign-out

The backend server supports two modes of signing out users.

1. If a client requests `/v1/accounts/signOut` API endpoint with the
   `X-Refresh-Token` header, the backend server immediately revokes the token.
   The backend server does not offer to revoke access tokens because of their
   short expiration. The clients must immediately discard access tokens from
   their storage when a user initiates sign-out.

2. When a client requests `/v1/accounts/signOut` API endpoint with the refresh
   token cookie, the backend server immediately revokes the token. The backend
   server then voids both the refresh token and the access token cookies by
   adding `Set-Cookie` headers to the response.

## Consuming Protected Resources

The backend server uses access tokens to authorise access to all protected
resources. It accepts access tokens via cookies or a bearer token in the
`Authorization` request headers. e.g.

```http
Authorization: Bearer <access-jwt>
```

```http
Cookie: atc=<access-jwt>
```

## Security Considerations

### Password-less Authentication

The users don't have to bear the burden of remembering, storing or rotating
their passwords. On each sign-in request, their access to the registered email
validates their authenticity.

### Versioned Refresh Tokens

The backend server issues versioned refresh tokens to all users. It is similar
to maintaining a chain of refresh tokens. When a client requests new credentials
for a user, the backend server increments the version of the refresh token and
persists it to the data store. It also assigns the same version to the returned
(new) refresh JWT.

In the event of a refresh token theft, two clients will possess the same refresh
token. If the backend server receives more than one credential issuance request
using the same token, there will be a mismatch between the ordinal claimed by
the refresh token and the one known to the backend server. The backend server
handles this mismatch by immediately revoking the refresh token, thus, denying
further access to both the legitimate and the illegitimate user.
