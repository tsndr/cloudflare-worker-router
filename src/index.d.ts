/// <reference types="@cloudflare/workers-types" />
/**
     * Route Object
     *
     * @typedef Route
     * @property {string} method HTTP request method
     * @property {string} url URL String
     * @property {RouterHandler[]} handlers Array of handler functions
     */
interface Route {
    method: string;
    url: string;
    handlers: RouterHandler[];
}
/**
 * Router Context
 *
 * @typedef RouterContext
 * @property {Object<string, string>} env Environment
 * @property {RouterRequest} req Request Object
 * @property {RouterResponse} res Response Object
 * @property {RouterNext} next Next Handler
 */
interface RouterContext {
    env: any;
    req: RouterRequest;
    res: RouterResponse;
    next: RouterNext;
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
 * @property {any} body Only available if method is `POST`, `PUT`, `PATCH` or `DELETE`. Contains either the received body string or a parsed object if valid JSON was sent.
 * @property {IncomingRequestCfProperties=} cf object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
 */
interface RouterRequest {
    url: string;
    method: string;
    params: RouterRequestParams;
    query: RouterRequestQuery;
    headers: Headers;
    body: any;
    cf?: IncomingRequestCfProperties;
}
interface RouterRequestParams {
    [key: string]: string;
}
interface RouterRequestQuery {
    [key: string]: string;
}
/**
 * Response Object
 *
 * @typedef RouterResponse
 * @property {Headers} headers Response headers object
 * @property {number=204} status Return status code (default: `204`)
 * @property {any=} body Either an `object` (will be converted to JSON) or a string
 * @property {Response=} raw A response object that is to be returned, this will void all other res properties and return this as is.
 */
interface RouterResponse {
    headers: Headers;
    status?: number;
    body?: any;
    raw?: Response;
    webSocket?: WebSocket;
}
/**
 * Next Function
 *
 * @callback RouterNext
 * @returns {Promise}
 */
interface RouterNext {
    (): Promise<void>;
}
/**
 * Handler Function
 *
 * @callback RouterHandler
 * @param {RouterContext} ctx
 * @returns {Promise<void> | void}
 */
interface RouterHandler {
    (ctx: RouterContext): Promise<void> | void;
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
interface RouterCorsConfig {
    allowOrigin: string;
    allowMethods: string;
    allowHeaders: string;
    maxAge: number;
    optionsSuccessStatus: number;
}
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
    protected routes: Route[];
    /**
     * Global Handlers
     */
    protected globalHandlers: RouterHandler[];
    /**
     * Debug Mode
     *
     * @protected
     * @type {boolean}
     */
    protected debugMode: boolean;
    /**
     * CORS Config
     *
     * @protected
     * @type {RouterCorsConfig}
     */
    protected corsConfig: RouterCorsConfig;
    /**
     * Register global handlers
     *
     * @param {RouterHandler[]} handlers
     * @returns {Router}
     */
    use(...handlers: RouterHandler[]): Router;
    /**
     * Register CONNECT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    connect(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register DELETE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    delete(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register GET route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    get(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register HEAD route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    head(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register OPTIONS route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    options(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register PATCH route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    patch(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register POST route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    post(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register PUT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    put(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register TRACE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    trace(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Register route, ignoring method
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    any(url: string, ...handlers: RouterHandler[]): Router;
    /**
     * Debug Mode
     *
     * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
     */
    debug(state?: boolean): void;
    /**
     * Enable CORS support
     *
     * @param {RouterCorsConfig} config
     * @returns {Router}
     */
    cors(config: RouterCorsConfig): Router;
    /**
     * Register route
     *
     * @private
     * @param {string} method HTTP request method
     * @param {string} url URL String
     * @param {RouterHandler[]} handlers Arrar of handler functions
     * @returns {Router}
     */
    private register;
    /**
     * Get Route by request
     *
     * @private
     * @param {Request} request
     * @returns {RouterRequest | undefined}
     */
    private getRoute;
    /**
     * Handle requests
     *
     * @param {any} env
     * @param {Request} request
     * @param {any=} extend
     * @returns {Response}
     */
    handle(env: any, request: Request, extend?: any): Promise<Response>;
}
export default Router;
