# Cloudflare Workers Router

Cloudflare Workers Router is a super lightweight router (3.6 kB) with middleware support and ZERO dependencies for CloudFlare Workers, inspired by the express.js syntax.

When I was trying out Cloudflare Workers I almost immediately noticed how fast it was compared to other serverless offerings. So I wanted to build a full fledged API to see how it performs doing real work, but since I wasn't able to find a router that suited my needs I created my own.

## Contents

- [Usage](#usage)
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
