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
         * Global Handlers
         */
        this.globalHandlers = []

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
     * @property {Headers} headers Request headers object
     * @property {Object<string, string> | string} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
     * @property {Object<string, string | number>} cf object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
     */

    /**
     * Response Object
     * 
     * @typedef RouterResponse
     * @property {Headers} headers Response headers object
     * @property {number} status Return status code (default: `204`)
     * @property {Object<string, string> | string} body Either an `object` (will be converted to JSON) or a string
     * @property {Response} raw A response object that is to be returned, this will void all other res properties and return this as is.
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
     * @param {RouterRequest} request
     * @param {RouterResponse} response
     * @param {RouterNext} next
     */

    /**
     * Register global handler
     * 
     * @param {RouterHandler} handler
     */
    use(handlers) {
        this.globalHandlers.push(handlers)
        return this
    }

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
     * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
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
            allowOrigin: config.allowOrigin || '*',
            allowMethods: config.allowMethods || '*',
            allowHeaders: config.allowHeaders || '*, Authorization',
            maxAge: config.maxAge || 86400,
            optionsSuccessStatus: config.optionsSuccessStatus || 204
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
     * @returns {Route | undefined}
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
     * @param {Request} request
     * @param {any=} extend
     * @returns {Response}
     */
    async handle(request, extend = {}) {
        try {
            if (request instanceof Event) {
                request = request.request
                console.warn("Warning: Using `event` on `router.handle()` is deprecated and might go away in future versions, please use `event.request` instead.")
            }
            const req = {
                ...extend,
                method: request.method,
                headers: request.headers,
                url: request.url,
                params: [],
                query: {},
                body: ''
            }
            if (req.method === 'OPTIONS' && Object.keys(this.corsConfig).length) {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': this.corsConfig.allowOrigin,
                        'Access-Control-Allow-Methods': this.corsConfig.allowMethods,
                        'Access-Control-Allow-Headers': this.corsConfig.allowHeaders,
                        'Access-Control-Max-Age': this.corsConfig.maxAge
                    },
                    status: this.corsConfig.optionsSuccessStatus
                })
            }
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                if (req.headers.has('Content-Type') && req.headers.get('Content-Type').includes('json')) {
                    try {
                        req.body = await request.json()
                    } catch {
                        req.body = {}
                    }
                } else {
                    try {
                        req.body = await request.text()
                    } catch {
                        req.body = ''
                    }
                }
            }
            const route = this.getRoute(req)
            if (!route) {
                return new Response(this.debugMode ? 'Route not found!' : null, {
                    status: 404
                })
            }
            const res = { headers: new Headers() }
            if (Object.keys(this.corsConfig).length) {
                res.headers.set('Access-Control-Allow-Origin', this.corsConfig.allowOrigin)
                res.headers.set('Access-Control-Allow-Methods', this.corsConfig.allowMethods)
                res.headers.set('Access-Control-Allow-Headers', this.corsConfig.allowHeaders)
                res.headers.set('Access-Control-Max-Age', this.corsConfig.maxAge)
            }
            const handlers = [...this.globalHandlers, ...route.handlers]
            let prevIndex = -1
            const runner = async index => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times')
                prevIndex = index
                if (typeof handlers[index] === 'function')
                    await handlers[index](req, res, async () => await runner(index + 1))
            }
            await runner(0)
            if (typeof res.body === 'object') {
                if (!res.headers.has('Content-Type'))
                    res.headers.set('Content-Type', 'application/json')
                res.body = JSON.stringify(res.body)
            }
            if (res.raw) {
                return res.raw
            }

            const resInit = {
                status: res.status || (res.body ? 200 : 204),
                headers: res.headers
            }

            if (res.webSocket) {
                resInit.webSocket = res.webSocket
            }

            return new Response(res.body, resInit)
        } catch(err) {
            console.error(err)
            return new Response(this.debugMode ? err.stack : '', { status: 500 })
        }
    }
}

module.exports = Router
