# Migration Guide

From `v1.x.x` to `v2.x.x`.

## Contents

- [Preparation](#preparation)
- [Update](#update)
- [Import / Require](#import--require)
- [Routes](#routes)
- [Fetch](#fetch--routerhandle)


## Preparation

Follow Cloudflare's [Migration Guide](https://developers.cloudflare.com/workers/wrangler/migration/migrating-from-wrangler-1/) to update your protject to [wrangler2](https://github.com/cloudflare/wrangler2).

## Update

Update to the latest version version of the router.

```bash
npm i -D @tsndr/cloudflare-worker-router
```

## Import / Require

Switch from `require()` to `import`.

### Before

```javascript
const Router = require('@tsndr/cloudflare-worker-router')
```


### After

```javascript
import Router from '@tsndr/cloudflare-worker-router'
```


## Routes

Just add curly braces `{}`.


### Before

<a href="https://gist.github.com/tsndr/34e8544266ae15d51abd019d7c3d27ca" target="_blank"><img width="469" alt="Petrify 2022-06-24 at 5 57 01 PM" src="https://user-images.githubusercontent.com/2940127/175572731-a8729c1b-15e2-45ac-be80-7e8527c5502a.png"></a>


### After

<a href="https://gist.github.com/tsndr/8db6e8dd55e348015c2ff8e93dd6aa31" target="_blank"><img width="469" alt="Petrify 2022-06-24 at 5 55 56 PM" src="https://user-images.githubusercontent.com/2940127/175572549-0eea8fc4-3d90-412a-89cc-d2f4569f1139.png"></a>
