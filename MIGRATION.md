# Migration Guide

From `v2.x.x` to `v3.x.x`.


## Contents

- [Update Router](#update-router)
- [Handlers](#handlers)
- [Fetch](#fetch--routerhandle)


## Update Router

Update to the latest version version of the router.

```bash
npm i -D @tsndr/cloudflare-worker-router@^3
```


## Handlers

- Remove `res` and `next` from handler parameter list.
- Replace `res.` with `return new Response()` / `return Response.json()`.
- Remove `next()` calls from middlewares.


### Before

```typescript
// Register global middleware
router.use(({ env, req, res, next }) => {
    if (req.headers.get('authorization') !== env.SECRET_TOKEN) {
        res.status = 401
        return
    }

    next()
})

// Simple get
router.get('/user', ({ res }) => {
    res.body = {
        id: 1,
        name: 'John Doe'
    }
})
```


### After

```typescript
// Register global middleware
router.use(({ env, req }) => {
    // Intercept if token doesn't match
    if (req.headers.get('authorization') !== env.SECRET_TOKEN) {
        return new Response(null, { status: 401 })
    }
})

// Simple get
router.get('/user', () => {
    return Response.json({
        id: 1,
        name: 'John Doe'
    })
})
```
