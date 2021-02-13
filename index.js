class Router {
    constructor() {
        this.routes = []
        this.corsConfig = {}
    }

    connect(url, ...handlers) {
        return this.register('CONNECT', url, handlers)
    }

    delete(url, ...handlers) {
        return this.register('DELETE', url, handlers)
    }

    get(url, ...handlers) {
        return this.register('GET', url, handlers)
    }

    head(url, ...handlers) {
        return this.register('HEAD', url, handlers)
    }

    options(url, ...handlers) {
        return this.register('OPTIONS', url, handlers)
    }

    patch(url, ...handlers) {
        return this.register('PATCH', url, handlers)
    }

    post(url, ...handlers) {
        return this.register('POST', url, handlers)
    }

    put(url, ...handlers) {
        return this.register('PUT', url, handlers)
    }

    trace(url, ...handlers) {
        return this.register('TRACE', url, handlers)
    }

    all(url, ...handlers) {
        return this.register('*', url, handlers)
    }

    cors(config) {
        config = config || {}
        this.corsConfig = {
            allowOrigin: '*',
            allowMethods: '*',
            allowHeaders: '*',
            maxAge: 86400,
            optionsSuccessStatus: 204
        }
        return this
    }

    register(method, url, handlers) {
        this.routes.push({
            method,
            url,
            handlers
        })
        return this
    }

    getRoute(request) {
        const urlArr = (new URL(request.url)).pathname.split('/').filter(i => i)
        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i)
            if (![request.method, '*'].includes(r.method) || routeArr.length !== urlArr.length)
                return false
            const params = {}
            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== urlArr[i] && routeArr[i][0] !== ':')
                    return false
                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = urlArr[i]
            }
            request.params = params
            return true
        })
    }

    async handle(event) {
        const request = { headers: event.request.headers, method: event.request.method, url: event.request.url }
        request.params = []
        if (request.method === 'OPTIONS' && Object.keys(this.corsConfig).length) {
            return new Response('', {
                headers: {
                    'Access-Control-Allow-Origin': this.corsConfig.allowOrigin,
                    'Access-Control-Allow-Methods': this.corsConfig.allowMethods,
                    'Access-Control-Allow-Headers': this.corsConfig.allowHeaders,
                    'Access-Control-Max-Age': this.corsConfig.maxAge
                },
                status: this.corsConfig.optionsSuccessStatus
            })
        }
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            try {
                request.body = await event.request.json()
            } catch {
                try {
                    request.body = await event.request.text()
                } catch {}
            }
        }
        const route = this.getRoute(request)
        if (!route) {
            return new Response('', {
                status: 404
            })
        }
        const response = { headers: {} }
        if (Object.keys(this.corsConfig).length) {
            response.headers = {
                ...response.headers,
                'Access-Control-Allow-Origin': this.corsConfig.allowOrigin,
                'Access-Control-Allow-Methods': this.corsConfig.allowMethods,
                'Access-Control-Allow-Headers': this.corsConfig.allowHeaders,
                'Access-Control-Max-Age': this.corsConfig.maxAge,
            }
        }
        let prevIndex = -1
        try {
            const runner = async index => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times')
                prevIndex = index
                if (typeof route.handlers[index] === 'function')
                    await route.handlers[index](request, response, async () => await runner(index + 1))
            }
            await runner(0)
        } catch(err) {
            console.error(err)
            return new Response('', {
                status: 500
            })
        }
        const headers = Object.assign({ 'Content-Type': 'application/json' }, response.headers)
        if (headers['Content-Type'] === 'application/json' && typeof response.body === 'object')
            response.body = JSON.stringify(response.body)
        return new Response(response.body, {
            status: response.status || (response.body ? 200 : 500),
            headers
        })
    }
}


module.exports = Router