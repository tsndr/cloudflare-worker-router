# Cloudflare Workers Router

Cloudflare Workers Router is a super lightweight router (3.6 kB) with middleware support and ZERO dependencies for Cloudflare Workers, inspired by the [Express.js](https://expressjs.com/) syntax.

When I was trying out Cloudflare Workers I almost immediately noticed how fast it was compared to other serverless offerings. So I wanted to build a full-fledged API to see how it performs doing real work, but since I wasn't able to find a router that suited my needs I created my own.

I worked a lot with [Express.js](https://expressjs.com/) in the past and really enjoyed their middleware approach, but since none of the available Cloudflare Worker routers offered middleware support at the time, I felt the need to create this router.

Attention: It's not directly compatible with [Express.js](https://expressjs.com/), it only follows the same approach.


## Contents

- [Usage](#usage)
- [Reference](#reference)
- [Setup](#setup)


## Usage

### Simple Example

```javascript
const Router = require('@tsndr/cloudflare-worker-router')
const router = new Router()

// Enabling buildin CORS support
router.cors()

// Simple get
router.get('/user', (req, res) => {

  res.body = {
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
})

// Post route with url parameter
router.post('/user/:id', (req, res) => {

  const userId = req.params.id
  
  // Do stuff...
  
  if (errorDoingStuff) {
    res.status = 400
    res.body = {
      error: 'User did stupid stuff!'
    }
    return
  }
  
  res.status = 204
})

// Delete route using a middleware
router.delete('/user/:id', (req, res, next) => {

  if (!apiTokenIsCorrect) {
    res.status = 401
    return
  }
  
  await next()
}, (req, res) => {

  const userId = req.params.id
  
  // Do stuff...
})

// Listen Cloudflare Workers Fetch Event
addEventListener('fetch', event => {
  event.respondWith(router.handle(event))
})
```


## Reference

### `router.debug([state])`

Enable or disable debug mode. Which will return the `error.stack` in case of an exception instead of and empty `500` response. Debug mode is disabled by default.

#### `state`
State is a `boolean` which determines if debug mode should be enabled or not (default: `true`)


### `router.cors([config])`

If enabled will overwrite other `OPTIONS` requests.

#### `config` (object, optional)

Key                    | Type      | Default Value
---------------------- | --------- | -------------
`allowOrigin`          | `string`  | `*`
`allowMethods`         | `string`  | `*`
`allowHeaders`         | `string`  | `*`
`maxAge`               | `integer` | `86400`
`optionsSuccessStatus` | `integer` | `204`


### `router.any(url, [...handlers])`
### `router.connect(url, [...handlers])`
### `router.delete(url, [...handlers])`
### `router.get(url, [...handlers])`
### `router.head(url, [...handlers])`
### `router.options(url, [...handlers])`
### `router.patch(url, [...handlers])`
### `router.post(url, [...handlers])`
### `router.put(url, [...handlers])`
### `router.trace(url, [...handlers])`

#### `url` (string)

The URL starting with a `/`.
Supports the use of dynamic parameters, prefixed with a `:` (i.e. `/user/:userId/edit`) which will be available through the [`req`-Object](#req-object) (i.e. `req.params.userId`).

#### `handlers` (function, optional)

An unlimited number of functions getting [`req`](#req-object) and [`res`](#res-object) passed into them.


### `req`-Object

Key       | Type                | Description
--------- | ------------------- | -----------
`body`    | `object` / `string` | Only available if method is `POST`, `PUT` or `PATCH`. Contains either the received body string or a parsed object if valid JSON was sent.
`headers` | `object`            | Object containing request headers
`method`  | `string`            | HTTP request method
`params`  | `object`            | Object containing all parameters defined in the url string
`query`   | `object`            | Object containing all query parameters


### `res`-Object

Key       | Type                | Description
--------- | ------------------- | -----------
`body`    | `object` / `string` | Either set an `object` (will be converted to JSON) or a string
`headers` | `object`            | Object you can set response headers in
`status`  | `integer`           | Return status code (default: `204`)


## Setup

### Wrangler

You can use [wrangler](https://github.com/cloudflare/wrangler) to generate a new Cloudflare Workers project based on this router by running the following command from your terminal:

```
wrangler generate myapp https://github.com/tsndr/cloudflare-worker-router-template
```

Before publishing your code you need to edit `wrangler.toml` file and add your Cloudflare `account_id` - more information about publishing your code can be found [in the documentation](https://developers.cloudflare.com/workers/learning/getting-started).

Once you are ready, you can publish your code by running the following command:

```
wrangler publish
```

You can also test it loacally by running the following command:

```
wrangler dev
```


### npm

If you already have a wrangler project you can install the router like this:

```
npm i @tsndr/cloudflare-worker-router
```


### Serverless

To deploy using serverless add a [`serverless.yml`](https://serverless.com/framework/docs/providers/cloudflare/) file.
