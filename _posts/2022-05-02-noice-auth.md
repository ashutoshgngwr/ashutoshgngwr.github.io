---
date: 2022-05-02 19:52:45 +0530
image: noice-auth-0.png
layout: post
mathjax: false
tags: noice backend authentication rest-api web
title: Designing a passwordless authentication system for Noice
---

Managing passwords requires effort, and we can certainly do without it. Ergo, I
started with the goal of designing a passwordless authentication system for
Noice. An end-user inputs their email address to receive a link. They can open
this link using a Noice client to finish signing in. I borrowed concepts from
the OAuth specification and reduced them to fit a simple authentication flow. I
didn't use an OAuth server implementation because it is too complex to use in a
(relatively) small project.

This design isn't new; almost every simplified authentication flow with
persistent sessions uses a similar design.
[`adam-hanna/jwt-auth`](https://github.com/adam-hanna/jwt-auth) is one such
implementation for Golang.

![auth-flow](/assets/posts/img/noice-auth-0.png)
*Authentication flow overview*

## Terminology

### Protected Resource

A protected resource is an object (API endpoint or otherwise) that only an
authorised user can access.

### Refresh Token

A refresh token is a long-lived JWT that expires a week after its issuance. It
proves to the server that a user has authenticated.

### Sign-in Token

A sign-in token is a refresh token with a shorter expiration (about 15 minutes).
It is sent to the user's email when they request a sign-in.

### Access Token

An access token is a short-lived JWT that expires 30 minutes after its issuance.
The server uses access tokens to authorise access to protected resources.

### Credential Exchange

When access tokens expire, the clients use refresh tokens to reestablish the
authenticity of the user and issue new refresh and access token pairs.

## Signing Up and Signing In

The clients provide email addresses to both of these operations. The server
validates the request and sends a sign-in URL to the provided email address.
When the user opens the URL using a client, the client obtains the sign-in token
from the URL and performs a credential exchange to complete the sign-in flow.
Other variants of this flow can replace email addresses with phone numbers or
sign-in links with one-time passwords.

## Issuing New Credentials

Clients regularly exchange their credentials to keep users signed in. The server
implements an API endpoint to perform a credential exchange. Every time a
credential exchange happens, the server renews the refresh and access token pair
and extends their expiration.

### Versioned Refresh Tokens

The server issues versioned refresh tokens to all users. It is similar to
maintaining all issued refresh tokens in the data store. When a client requests
new credentials for a user, the server increments the version of the refresh
token in the JWT payload and persists it in the data store. Hence, the
credential exchange is a stateful process.

In the event of a refresh token theft, two clients will possess the same refresh
token. If the server receives more than one credential exchange request using
the same refresh token, there will be a mismatch between the token version
claimed by the JWT payload and the one known to the server. The server handles
this mismatch by immediately revoking the refresh token. Thus, both the
legitimate and the illegitimate users need to reauthenticate to regain access.

## Consuming Protected Resources

The clients provide valid access tokens to access protected resources. If an
access token is invalid, the server returns `HTTP 401` for all protected
resources. In such cases, the clients should perform a credential exchange
before retrying this request.

The server delegates the access token validation and the request authorisation
to a middleware. The access token carries the information required for
authorising requests. It keeps the authorisation flow in the middleware
stateless.

## Signing Out

The client presents a refresh and access token pair to the server for signing
out. The token's JWT payload contains an identifier recognised by the server.
The server revokes the refresh token using this identifier from its data store.
It also uses an in-memory cache to store *dangling* access tokens until their
expiration. Upon successful sign-out, the server refuses any subsequent requests
using the same refresh or access token.

## Demo

I have the Noice API's staging environment set up. Please feel free to try out
its authentication. FYI, the API server will refuse requests with `HTTP 502`
when it is down.

To perform the sign-up operation, make the following `POST` request.

```sh
curl -v -L -X POST 'https://api.trynoice.com/v1/accounts/signUp' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name": "<Your name>",
    "email": "<Your email>"
  }'
```

The API will send a sign-in link to the registered email. Copy the sign-in token
from the token query parameter in the link. Then use the following `GET` request
to obtain a refresh and access token pair.

```sh
curl -v -L -X GET 'https://api.trynoice.com/v1/accounts/credentials' \
  -H 'X-Refresh-Token: <Your sign-in token>'
```

On obtaining a new access token, you can view your profile by making the
following `GET` request.

```sh
curl -v -L -X GET 'https://api.trynoice.com/v1/accounts/profile' \
  -H 'Authorization: Bearer <Your access token>'
```

To test credentials exchange, replace the sign-in token in the second request
with the refresh token obtained in the third request. You can then fetch your
profile again with the new access token.

Make the following `GET` request with the latest refresh and access token pair
to sign out.

```sh
curl -v -L -X GET 'https://api.trynoice.com/v1/accounts/signOut' \
  -H 'X-Refresh-Token: <Your refresh token>' \
  -H 'Authorization: Bearer <Your access token>'
```

Make the following `POST` request to sign-in again. Then perform a credentials
exchange.

```sh
curl -v -L -X POST 'https://api.trynoice.com/v1/accounts/signIn' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "email": "<Registered email>"
  }'
```
