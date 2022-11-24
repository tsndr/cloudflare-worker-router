# Cloudflare Workers Router

Cloudflare Workers Router is a super lightweight router (1.3K gzipped) with middleware support and **ZERO dependencies** for [Cloudflare Workers](https://workers.cloudflare.com/).

When I was trying out Cloudflare Workers I almost immediately noticed how fast it was compared to other serverless offerings. So I wanted to build a full-fledged API to see how it performs doing real work, but since I wasn't able to find a router that suited my needs I created my own.

I worked a lot with [Express.js](https://expressjs.com/) in the past and really enjoyed their middleware approach, but since none of the available Cloudflare Worker routers offered middleware support at the time, I felt the need to create this router.


## Contents

- [Features](#features)
- [Usage](#usage)
- [Reference](#reference)
- [Setup](#setup)


## Features

- ZERO dependencies
- Lightweight (1.3K gzipped)
- Fully written in TypeScript
- Integrated Debug-Mode & CORS helper
- Built specifically around Middlewares


## Usage

### TypeScript Example

```typescript
import { Router } from '@tsndr/cloudflare-worker-router'

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket
}


// Initialize router
const router = new Router<Env>()

// Enabling build in CORS support
router.cors()

// Register global middleware
router.use(({ req, res, next }) => {
    res.headers.set('X-Global-Middlewares', 'true')
    next()
})

// Simple get
router.get('/user', ({ req, res }) => {
    res.body = {
        data: {
            id: 1,
            name: 'John Doe'
        }
    }
})

// Post route with url parameter
router.post('/user/:id', ({ req, res }) => {

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
router.delete('/user/:id', ({ req, res, next }) => {

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
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        return router.handle(env, request)
    }
}
```

<details>
    <summary>JavaScript Example</summary>

```javascript
import { Router } from '@tsndr/cloudflare-worker-router'

// Initialize router
const router = new Router()

// Enabling build in CORS support
router.cors()

// Register global middleware
router.use(({ req, res, next }) => {
    res.headers.set('X-Global-Middlewares', 'true')
    next()
})

// Simple get
router.get('/user', ({ req, res }) => {
    res.body = {
        data: {
            id: 1,
            name: 'John Doe'
        }
    }
})

// Post route with url parameter
router.post('/user/:id', ({ req, res }) => {

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
router.delete('/user/:id', ({ req, res, next }) => {

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
export default {
    async fetch(request, env) {
        return router.handle(env, request)
    }
}
```
</details>


## Reference

### `router.debug([state = true])`

Enable or disable debug mode. Which will return the `error.stack` in case of an exception instead of and empty `500` response. Debug mode is disabled by default.


#### `state`
State is a `boolean` which determines if debug mode should be enabled or not (default: `true`)

Key                    | Type      | Default Value
---------------------- | --------- | -------------
`state`                | `boolean` | `true`


### `router.use([...handlers])`

Register a global middleware handler.


#### `handler(ctx)`

Handler is a `function` which will be called for every request.


#### `ctx`

Object containing `env`, [`req`](#req-object), [`res`](#res-object), `next`


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


### Supported Methods

- `router.any(url, [...handlers])`
- `router.connect(url, [...handlers])`
- `router.delete(url, [...handlers])`
- `router.get(url, [...handlers])`
- `router.head(url, [...handlers])`
- `router.options(url, [...handlers])`
- `router.patch(url, [...handlers])`
- `router.post(url, [...handlers])`
- `router.put(url, [...handlers])`
- `router.trace(url, [...handlers])`


#### `url` (string)

The URL starting with a `/`.
Supports the use of dynamic parameters, prefixed with a `:` (i.e. `/user/:userId/edit`) which will be available through the [`req`-Object](#req-object) (i.e. `req.params.userId`).


#### `handlers` (function, optional)

An unlimited number of functions getting [`req`](#req-object) and [`res`](#res-object) passed into them.


### `ctx`-Object
Key       | Type                | Description
--------- | ------------------- | -----------
`env`     | `object`            | Environment
`req`     | `req`-Object        | Request Object
`res`     | `res`-Object        | Response Object
`next`    | `next`-Handler      | Next Handler


### `req`-Object

Key       | Type                | Description
--------- | ------------------- | -----------
`body`    | `object` / `string` | Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
`headers` | `Headers`           | Request [Headers Object](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
`method`  | `string`            | HTTP request method
`params`  | `object`            | Object containing all parameters defined in the url string
`query`   | `object`            | Object containing all query parameters


### `res`-Object

Key         | Type                | Description
----------- | ------------------- | -----------
`body`      | `object` / `string` | Either set an `object` (will be converted to JSON) or a string
`headers`   | `Headers`           | Response [Headers Object](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
`status`    | `integer`           | Return status code (default: `204`)
`webSocket` | `WebSocket`         | Upgraded websocket connection


## Setup

Please follow Cloudflare's [Get started guide](https://developers.cloudflare.com/workers/get-started/guide/) to install wrangler, then install the router using this command:


#### Initialize Project

```bash
wrangler init <name>
```

Use of TypeScript is strongly encouraged :)

```bash
npm i -D @tsndr/cloudflare-worker-router
```


### TypeScript (<code>src/index.ts</code>)

```typescript
import { Router } from '@tsndr/cloudflare-worker-router'

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket
}

const router = new Router<Env>()

/// Example Route
//
// router.get(/'hi', ({ res }) => {
//    res.body = 'Hello World'
//}


/// Example Route for splitting into multiple files
//
// const hiHandler: RouteHandler<Env> = ({ res }) => {
//     res.body = 'Hello World'
// }
//
// router.get('/hi', hiHandler)


// TODO: add your routes here

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return router.handle(env, request)
    }
}
```


### JavaScript (<code>src/index.js</code>)

<details>
    <summary>Consider using TypeScript instead :)</summary>

```javascript
import { Router } from '@tsndr/cloudflare-worker-router'

const router = new Router()

// router.get(/'hi', ({ res }) => {
//    res.body = 'Hello World'
//}

// TODO: add your routes here

export default {
    async fetch(request, env, ctx) {
        return router.handle(env, request)
    }
}
```
