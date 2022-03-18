export = Router
/**
 * Router
 *
 * @class
 * @constructor
 * @public
 */
declare class Router {
    /**
     * Router Array
     *
     * @protected
     * @type {Route[]}
     */
    protected routes: Route[]
    /**
     * Global Handlers
     * 
     * @protected
     * @type {Handler[]}
     */
    protected globalHandlers: Handler[]
    /**
     * Debug Mode
     * 
     * @protected
     * @type {boolean}
     */
    protected debugMode: boolean
    /**
     * CORS Config
     *
     * @protected
     * @type {RouterCorsConfig}
     */
    protected corsConfig: RouterCorsConfig
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
     * @property {Object<string, string> | string} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
     * @property {Object<string, string | number>} cf object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
     */
    /**
     * Response Object
     *
     * @typedef RouterResponse
     * @property {Object<string, string>} headers Object you can set response headers in
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
     * @param {Request} request
     * @param {Response} response
     * @param {next} next
     */
    /**
     * Register global handler
     * 
     * @param {RouterHandler} handler
     * @param handlers 
     */
    use(handler: RouterHandler): Router
    /**
     * Register CONNECT route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    connect(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register DELETE route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    delete(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register GET route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    get(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register HEAD route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    head(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register OPTIONS route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    options(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register PATCH route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    patch(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register POST route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    post(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register PUT route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    put(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register TRACE route
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    trace(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register route, ignoring method
     *
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    any(url: string, ...handlers: RouterHandler[]): Router
    /**
     * Register route, ignoring method
     *
     * @deprecated since version 1.0.2, use .any(url, ...handlers) instead.
     * @param {string} url
     * @param  {...RouterHandler} handlers
     * @returns {Router}
     */
    all(url: string, ...handlers: RouterHandler[]): Router
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
     * Debug Mode
     * 
     * @param {boolean} state Whether to turn on or off debug mode (default: true)
     */
    debug(state: boolean): void
    /**
     * Enable CORS support
     *
     * @param {RouterCorsConfig} config
     * @returns {Router}
     */
    cors(config?: RouterCorsConfig): Router
    /**
     * Register route
     *
     * @private
     * @param {string} method HTTP request method
     * @param {string} url URL String
     * @param {RouterHandler[]} handlers Arrar of handler functions
     * @returns {Router}
     */
    private register(method: string, url: string, handlers: RouterHandler[]): Router
    /**
     * Get Route by request
     *
     * @private
     * @param {Request} request
     * @returns {Route | undefined}
     */
     private getRoute(request: Request): Route | undefined
    /**
     * Handle requests
     *
     * @param {Request} request
     * @returns {Response}
     */
    handle(request: Request): Response
}
declare namespace Router {
    export { Route, RouterRequest, RouterResponse, RouterNext, RouterHandler, RouterCorsConfig }
}
/**
 * Route Object
 */
type Route = {
    /**
     * HTTP request method
     */
    method: string
    /**
     * URL String
     */
    url: string
    /**
     * Array of handler functions
     */
    handlers: RouterHandler[]
}
/**
 * CORS Config
 */
type RouterCorsConfig = {
    /**
     * Access-Control-Allow-Origin (default: `*`)
     */
    allowOrigin: string
    /**
     * Access-Control-Allow-Methods (default: `*`)
     */
    allowMethods: string
    /**
     * Access-Control-Allow-Headers (default: `*`)
     */
    allowHeaders: string
    /**
     * Access-Control-Max-Age (default: `86400`)
     */
    maxAge: number
    /**
     * Return status code for OPTIONS request (default: `204`)
     */
    optionsSuccessStatus: number
}
/**
 * Handler Function
 */
type RouterHandler = (req: RouterRequest, res: RouterResponse, next: RouterNext) => any
/**
 * Request Object
 */
type RouterRequest = {
    /**
     * HTTP request method
     */
    method: string
    /**
     * Object containing request headers
     */
    headers: Headers
    /**
     * URL String
     */
    url: string
    /**
     * Environment object
     */
    env: any
    /**
     * Context object
     */
    ctx: any
    /**
     * Cloudflare object
     */
    cf: any
    /**
     * Object containing all parameters defined in the url string
     */
    params: {
        [key: string]: string
    }
    /**
     * Only available if method is `POST`, `PUT` or `PATCH`. Contains either the received body string or a parsed object if valid JSON was sent.
     */
    body: any
}
/**
 * Response Object
 */
type RouterResponse = {
    /**
     * Object you can set response headers in
     */
    headers: Object<string, string>
    /**
     * Return status code (default: `204`)
     */
    status: number
    /**
     * A response object to be directly returned to the client
     */
    response: Response
    /**
     * Either an `object` (will be converted to JSON) or a string
     */
    body: {
        [key: string]: string
    } | string
}
/**
 * Next Function
 */
type RouterNext = () => Promise<void>
