/**
 * Route Object
 *
 * @typedef Route
 * @property {string} method HTTP request method
 * @property {string} url URL String
 * @property {RouterHandler[]} handlers Array of handler functions
 */
 export interface Route<TEnv> {
    method: string
    url: string
    handlers: RouterHandler<TEnv>[]
}

/**
 * Router Context
 *
 * @typedef RouterContext
 * @property {RouterEnv} env Environment
 * @property {RouterRequest} req Request Object
 * @property {RouterResponse} res Response Object
 * @property {RouterNext} next Next Handler
 */
export interface RouterContext<TEnv> {
    env: TEnv
    req: RouterRequest
    res: RouterResponse
    next: RouterNext
}

/**
 * Request Object
 *
 * @typedef RouterRequest
 * @property {string} url URL
 * @property {string} method HTTP request method
 * @property {RouterRequestParams} params Object containing all parameters defined in the url string
 * @property {RouterRequestQuery} query Object containing all query parameters
 * @property {Headers} headers Request headers object
 * @property {string | any} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
 * @property {IncomingRequestCfProperties} [cf] object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
 */
export interface RouterRequest {
    url: string
    method: string
    params: RouterRequestParams
    query: RouterRequestQuery
    headers: Headers
    body: string | any
    cf?: IncomingRequestCfProperties
    [key: string]: any
}

/**
 * Request Parameters
 *
 * @typedef RouterRequestParams
 */
export interface RouterRequestParams {
    [key: string]: string
}

/**
 * Request Query
 *
 * @typedef RouterRequestQuery
 */
export interface RouterRequestQuery {
    [key: string]: string
}

/**
 * Response Object
 *
 * @typedef RouterResponse
 * @property {Headers} headers Response headers object
 * @property {number} [status=204] Return status code (default: `204`)
 * @property {string | any} [body] Either an `object` (will be converted to JSON) or a string
 * @property {Response} [raw] A response object that is to be returned, this will void all other res properties and return this as is.
 */
export interface RouterResponse {
    headers: Headers
    status?: number
    body?: string | any
    raw?: Response,
    webSocket?: WebSocket
}

/**
 * Next Function
 *
 * @callback RouterNext
 * @returns {Promise<void>}
 */
export interface RouterNext {
    (): Promise<void>
}

/**
 * Handler Function
 *
 * @callback RouterHandler
 * @param {RouterContext} ctx
 * @returns {Promise<void> | void}
 */
export interface RouterHandler<TEnv = any> {
    (ctx: RouterContext<TEnv>): Promise<void> | void
}

/**
 * CORS Config
 *
 * @typedef RouterCorsConfig
 * @property {string} [allowOrigin="*"] Access-Control-Allow-Origin (default: `*`)
 * @property {string} [allowMethods="*"] Access-Control-Allow-Methods (default: `*`)
 * @property {string} [allowHeaders="*"] Access-Control-Allow-Headers (default: `*`)
 * @property {number} [maxAge=86400] Access-Control-Max-Age (default: `86400`)
 * @property {number} [optionsSuccessStatus=204] Return status code for OPTIONS request (default: `204`)
 */
export interface RouterCorsConfig {
    allowOrigin?: string
    allowMethods?: string
    allowHeaders?: string
    maxAge?: number
    optionsSuccessStatus?: number
}

/**
 * Router
 *
 * @public
 * @class
 */
export class Router<TEnv = any> {

    /**
     * Router Array
     *
     * @protected
     * @type {Route[]}
     */
    protected routes: Route<TEnv>[] = []

    /**
     * Global Handlers
     *
     * @protected
     * @type {RouterHandler[]}
     */
    protected globalHandlers: RouterHandler<TEnv>[] = []

    /**
     * Debug Mode
     *
     * @protected
     * @type {boolean}
     */
    protected debugMode: boolean = false

    /**
     * CORS Config
     *
     * @protected
     * @type {RouterCorsConfig}
     */
    protected corsConfig: RouterCorsConfig = {}

    /**
     * CORS enabled
     *-
     * @protected
     * @type {boolean}
     */
    protected corsEnabled: boolean = false

    /**
     * Register global handlers
     *
     * @param {RouterHandler[]} handlers
     * @returns {Router}
     */
    public use(...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        for (let handler of handlers) {
            this.globalHandlers.push(handler)
        }
        return this
    }

    /**
     * Register CONNECT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public connect(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('CONNECT', url, handlers)
    }

    /**
     * Register DELETE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public delete(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('DELETE', url, handlers)
    }

    /**
     * Register GET route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public get(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('GET', url, handlers)
    }

    /**
     * Register HEAD route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public head(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('HEAD', url, handlers)
    }

    /**
     * Register OPTIONS route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public options(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('OPTIONS', url, handlers)
    }

    /**
     * Register PATCH route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public patch(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('PATCH', url, handlers)
    }

    /**
     * Register POST route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public post(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('POST', url, handlers)
    }

    /**
     * Register PUT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public put(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('PUT', url, handlers)
    }

    /**
     * Register TRACE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public trace(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('TRACE', url, handlers)
    }

    /**
     * Register route, ignoring method
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    public any(url: string, ...handlers: RouterHandler<TEnv>[]): Router<TEnv> {
        return this.register('*', url, handlers)
    }

    /**
     * Debug Mode
     *
     * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
     * @returns {Router}
     */
    public debug(state: boolean = true): Router<TEnv> {
        this.debugMode = state
        return this
    }

    /**
     * Enable CORS support
     *
     * @param {RouterCorsConfig} [config]
     * @returns {Router}
     */
    public cors(config?: RouterCorsConfig): Router<TEnv> {
        this.corsEnabled = true
        this.corsConfig = {
            allowOrigin: config?.allowOrigin || '*',
            allowMethods: config?.allowMethods || '*',
            allowHeaders: config?.allowHeaders || '*',
            maxAge: config?.maxAge || 86400,
            optionsSuccessStatus: config?.optionsSuccessStatus || 204
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
    private register(method: string, url: string, handlers: RouterHandler<TEnv>[]): Router<TEnv> {
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
     * @param {RouterRequest} request
     * @returns {Route | undefined}
     */
    private getRoute(request: RouterRequest): Route<TEnv> | undefined {
        const url = new URL(request.url)
        const pathArr = url.pathname.split('/').filter(i => i)

        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i)

            if (![request.method, '*'].includes(r.method) || routeArr.length !== pathArr.length)
                return false

            const params: RouterRequestParams = {}

            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== pathArr[i] && routeArr[i][0] !== ':')
                    return false

                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = pathArr[i]
            }

            request.params = params

            const query: any = {}

            for (const [k, v] of url.searchParams.entries()) {
                query[k] = v
            }

            request.query = query

            return true
        }) || this.routes.find(r => r.url === '*' && [request.method, '*'].includes(r.method))
    }

    /**
     * Handle requests
     *
     * @param {TEnv} env
     * @param {Request} request
     * @param {any} [extend]
     * @returns {Promise<Response>}
     */
    public async handle(env: TEnv, request: Request, extend: any = {}): Promise<Response> {
        try {
            const req: RouterRequest = {
                ...extend,
                method: request.method,
                headers: request.headers,
                url: request.url,
                cf: request.cf,
                params: {},
                query: {},
                body: ''
            }

            const headers = new Headers()
            const route = this.getRoute(req)

            if (this.corsEnabled) {
                if (this.corsConfig.allowOrigin)
                    headers.set('Access-Control-Allow-Origin', this.corsConfig.allowOrigin)
                if (this.corsConfig.allowMethods)
                    headers.set('Access-Control-Allow-Methods', this.corsConfig.allowMethods)
                if (this.corsConfig.allowHeaders)
                    headers.set('Access-Control-Allow-Headers', this.corsConfig.allowHeaders)
                if (this.corsConfig.maxAge)
                    headers.set('Access-Control-Max-Age', this.corsConfig.maxAge.toString())

                if (!route && req.method === 'OPTIONS') {
                    return new Response(null, {
                        headers,
                        status: this.corsConfig.optionsSuccessStatus
                    })
                }
            }

            if (!route)
                return new Response(this.debugMode ? 'Route not found!' : null, { status: 404 })

            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                if (req.headers.has('Content-Type') && req.headers.get('Content-Type')!.includes('json')) {
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

            const res: RouterResponse = { headers }
            const handlers = [...this.globalHandlers, ...route.handlers]
            let prevIndex = -1

            const runner = async (index: number) => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times')

                prevIndex = index

                if (typeof handlers[index] === 'function')
                    await handlers[index]({ env, req, res, next: async () => await runner(index + 1) })
            }

            await runner(0)

            if (typeof res.body === 'object') {
                if (!res.headers.has('Content-Type'))
                    res.headers.set('Content-Type', 'application/json')

                res.body = JSON.stringify(res.body)
            }

            if (res.raw)
                return res.raw

            return new Response([101, 204, 205, 304].includes(res.status || (res.body ? 200 : 204)) ? null : res.body, { status: res.status, headers: res.headers, webSocket: res.webSocket || null })
        } catch(err) {
            console.error(err)
            return new Response(this.debugMode && err instanceof Error ? err.stack : '', { status: 500 })
        }
    }
}
