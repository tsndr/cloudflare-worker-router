/**
 * Router
 * 
 * @class
 * @constructor
 * @public
 */
class Router {

    constructor() {
        /**
         * Router Array
         * 
         * @protected
         * @type {Route[]}
         */
        this.routes = []

        /**
         * Debug Mode
         * 
         * @protected
         * @type {boolean}
         */
        this.debugMode = false

        /**
         * CORS Config
         * 
         * @protected
         * @type {RouterCorsConfig}
         */
        this.corsConfig = {}
    }

    /**
     * Route Object
     * 
     * @typedef Route
     * @property {string} method HTTP request method
     * @property {string} url URL String
     * @property {RouterHandler[]} handlers Array of handler functions
     */

    /**
     * Request Object
     * 
     * @typedef RouterRequest
     * @property {string} method HTTP request method
     * @property {Object<string, string>} params Object containing all parameters defined in the url string
     * @property {Object<string, string>} query Object containing all query parameters
     * @property {Object<string, string>} headers Object containing request headers
     * @property {Object<string, string>|string} body Only available if method is `POST`, `PUT` or `PATCH`. Contains either the received body string or a parsed object if valid JSON was sent.
     */

    /**
     * Response Object
     * 
     * @typedef RouterResponse
     * @property {Object<string, string>} headers Object you can set response headers in
     * @property {number} status Return status code (default: `204`)
     * @property {Object<string, string>|string} body Either an `object` (will be converted to JSON) or a string
     */

    /**
     * Next Function
     * 
     * @callback RouterNext
     * @returns {Promise}
     */

    /**
     * Handler Function
     * 
     * @callback RouterHandler
     * @param {Request} request
     * @param {Response} response
     * @param {RouterNext} next
     */

    /**
     * Register CONNECT route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    connect(url, ...handlers) {
        return this.register('CONNECT', url, handlers)
    }

    /**
     * Register DELETE route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    delete(url, ...handlers) {
        return this.register('DELETE', url, handlers)
    }

    /**
     * Register GET route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    get(url, ...handlers) {
        return this.register('GET', url, handlers)
    }

    /**
     * Register HEAD route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    head(url, ...handlers) {
        return this.register('HEAD', url, handlers)
    }

    /**
     * Register OPTIONS route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    options(url, ...handlers) {
        return this.register('OPTIONS', url, handlers)
    }

    /**
     * Register PATCH route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    patch(url, ...handlers) {
        return this.register('PATCH', url, handlers)
    }

    /**
     * Register POST route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    post(url, ...handlers) {
        return this.register('POST', url, handlers)
    }

    /**
     * Register PUT route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    put(url, ...handlers) {
        return this.register('PUT', url, handlers)
    }

    /**
     * Register TRACE route
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    trace(url, ...handlers) {
        return this.register('TRACE', url, handlers)
    }

    /**
     * Register route, ignoring method
     * 
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    any(url, ...handlers) {
        return this.register('*', url, handlers)
    }

    /**
     * Register route, ignoring method
     * 
     * @deprecated since version 1.0.2, use .any(url, ...handlers) instead.
     * @param {string} url 
     * @param  {...RouterHandler} handlers 
     * @returns {Router}
     */
    all(url, ...handlers) {
        console.warn('WARNING: This function is deprecated and will be removed in a future release, please use .any(url, ...handlers) instead.')
        return this.any(url, handlers)
    }

    /**
     * Debug Mode
     * 
     * @param {boolean} state Whether to turn on or off debug mode (default: true)
     */
    debug(state = true) {
        this.debugMode = state
    }

    /**
     * CORS Config
     * 
     * @typedef RouterCorsConfig
     * @property {string} allowOrigin Access-Control-Allow-Origin (default: `*`)
     * @property {string} allowMethods Access-Control-Allow-Methods (default: `*`)
     * @property {string} allowHeaders Access-Control-Allow-Headers (default: `*`)
     * @property {number} maxAge Access-Control-Max-Age (default: `86400`)
     * @property {number} optionsSuccessStatus Return status code for OPTIONS request (default: `204`)
     */

    /**
     * Enable CORS support
     * 
     * @param {RouterCorsConfig} config
     * @returns {Router}
     */
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

    /**
     * Register route
     * 
     * @private
     * @param {string} method HTTP request method
     * @param {string} url URL String
     * @param {RouterHandler[]} handlers Arrar of handler functions
     * @returns {Router}
     */
    register(method, url, handlers) {
        this.routes.push({
            method,
            url,
            handlers
        })
        return this
    }

    /**
     * Get Route by request
     * 
     * @private
     * @param {Request} request 
     * @returns {Route|undefined}
     */
    getRoute(request) {
        const url = new URL(request.url)
        const pathArr = url.pathname.split('/').filter(i => i)
        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i)
            if (![request.method, '*'].includes(r.method) || routeArr.length !== pathArr.length)
                return false
            const params = {}
            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== pathArr[i] && routeArr[i][0] !== ':')
                    return false
                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = pathArr[i]
            }
            request.params = params
            const query = {}
            for (const [k, v] of url.searchParams.entries()) {
                query[k] = v
            }
            request.query = query
            return true
        })
    }

    /**
     * Handle requests
     * 
     * @param {Event} event 
     * @returns {Response}
     */
    async handle(event) {
        const request = { headers: event.request.headers, method: event.request.method, url: event.request.url, event: event }
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
            return new Response(this.debugMode ? 'Route not found!' : '', {
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
            return new Response(this.debugMode ? err.stack : '', {
                status: 500
            })
        }
        const headers = Object.assign({ 'Content-Type': 'application/json' }, response.headers)
        if (headers['Content-Type'].includes('json') && typeof response.body === 'object')
            response.body = JSON.stringify(response.body)
        return new Response(response.body, {
            status: response.status || (response.body ? 200 : 500),
            headers
        })
    }
}

module.exports = Router