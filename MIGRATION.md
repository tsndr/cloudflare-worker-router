# Migration Guide

From `v1.x.x` to `v2.x.x`.

## Contents

- [Import / Require](#import--require)
- [Routes](#routes)
- [Fetch](#fetch)


## Import / Require

### Before

```javascript
const Router = require('@tsndr/cloudflare-worker-router')
```


### After

```javascript
import Router from '@tsndr/cloudflare-worker-router'
```


## Routes

Just add curly braces.


### Before

```javascript
// Register global middleware
router.use((req, res, next) => {
  res.headers.set('X-Global-Middlewares', 'true')
  next()
})

// Simple get
router.get('/user', (req, res) => {
  res.body = {
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
})
```


### After

<pre>
// Register global middleware
router.use((<span style="color:rgb(225, 75, 75);font-weight:bold;">{</span> req, res, next <span style="color:rgb(225, 75, 75);font-weight:bold;">}</span>) => {
  res.headers.set('X-Global-Middlewares', 'true')
  next()
})

// Simple get
router.get('/user', (<span style="color:rgb(225, 75, 75);font-weight:bold;">{</span> req, res <span style="color:rgb(225, 75, 75);font-weight:bold;">}</span>) => {
  res.body = {
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
})
</pre>


## Fetch / `router.handle()`

<span style="color:rgb(225, 75, 75);font-weight:bold;">!</span> Be aware that with `v2.0.0` the parameters of `router.handle()` changed <span style="color:rgb(225, 75, 75);font-weight:bold;">!</span> 


### Before

`router.handle(request, extend = {})`

```javascript
// Listen Cloudflare Workers Fetch Event
addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})
```


### After

`router.handle(env, request, extend = {})`

<pre>
// Listen Cloudflare Workers Fetch Event
export default {
  async fetch(request, env, ctx) {
    return router.handle(<span style="color:rgb(225, 75, 75);font-weight:bold;">env</span>, request)
  }
}
</pre>