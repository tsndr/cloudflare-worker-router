"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Router
 *
 * @class
 * @constructor
 * @public
 */
class Router {
    /**
     * Router Array
     *
     * @protected
     * @type {Route[]}
     */
    routes = [];
    /**
     * Global Handlers
     */
    globalHandlers = [];
    /**
     * Debug Mode
     *
     * @protected
     * @type {boolean}
     */
    debugMode = false;
    /**
     * CORS Config
     *
     * @protected
     * @type {RouterCorsConfig}
     */
    corsConfig = {
        allowOrigin: '*',
        allowMethods: '*',
        allowHeaders: '*',
        maxAge: 86400,
        optionsSuccessStatus: 204
    };
    /**
     * Register global handlers
     *
     * @param {RouterHandler[]} handlers
     * @returns {Router}
     */
    use(...handlers) {
        for (let handler of handlers) {
            this.globalHandlers.push(handler);
        }
        return this;
    }
    /**
     * Register CONNECT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    connect(url, ...handlers) {
        return this.register('CONNECT', url, handlers);
    }
    /**
     * Register DELETE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    delete(url, ...handlers) {
        return this.register('DELETE', url, handlers);
    }
    /**
     * Register GET route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    get(url, ...handlers) {
        return this.register('GET', url, handlers);
    }
    /**
     * Register HEAD route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    head(url, ...handlers) {
        return this.register('HEAD', url, handlers);
    }
    /**
     * Register OPTIONS route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    options(url, ...handlers) {
        return this.register('OPTIONS', url, handlers);
    }
    /**
     * Register PATCH route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    patch(url, ...handlers) {
        return this.register('PATCH', url, handlers);
    }
    /**
     * Register POST route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    post(url, ...handlers) {
        return this.register('POST', url, handlers);
    }
    /**
     * Register PUT route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    put(url, ...handlers) {
        return this.register('PUT', url, handlers);
    }
    /**
     * Register TRACE route
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    trace(url, ...handlers) {
        return this.register('TRACE', url, handlers);
    }
    /**
     * Register route, ignoring method
     *
     * @param {string} url
     * @param  {RouterHandler[]} handlers
     * @returns {Router}
     */
    any(url, ...handlers) {
        return this.register('*', url, handlers);
    }
    /**
     * Debug Mode
     *
     * @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
     */
    debug(state = true) {
        this.debugMode = state;
    }
    /**
     * Enable CORS support
     *
     * @param {RouterCorsConfig} config
     * @returns {Router}
     */
    cors(config) {
        config = config || {};
        this.corsConfig = {
            allowOrigin: config.allowOrigin || '*',
            allowMethods: config.allowMethods || '*',
            allowHeaders: config.allowHeaders || '*, Authorization',
            maxAge: config.maxAge || 86400,
            optionsSuccessStatus: config.optionsSuccessStatus || 204
        };
        return this;
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
        });
        return this;
    }
    /**
     * Get Route by request
     *
     * @private
     * @param {Request} request
     * @returns {RouterRequest | undefined}
     */
    getRoute(request) {
        const url = new URL(request.url);
        const pathArr = url.pathname.split('/').filter(i => i);
        return this.routes.find(r => {
            const routeArr = r.url.split('/').filter(i => i);
            if (![request.method, '*'].includes(r.method) || routeArr.length !== pathArr.length)
                return false;
            const params = {};
            for (let i = 0; i < routeArr.length; i++) {
                if (routeArr[i] !== pathArr[i] && routeArr[i][0] !== ':')
                    return false;
                if (routeArr[i][0] === ':')
                    params[routeArr[i].substring(1)] = pathArr[i];
            }
            request.params = params;
            const query = {};
            for (const [k, v] of url.searchParams.entries()) {
                query[k] = v;
            }
            request.query = query;
            return true;
        }) || this.routes.find(r => r.url === '*' && [request.method, '*'].includes(r.method));
    }
    /**
     * Handle requests
     *
     * @param {any} env
     * @param {Request} request
     * @param {any=} extend
     * @returns {Response}
     */
    async handle(env, request, extend = {}) {
        try {
            const req = {
                ...extend,
                method: request.method,
                headers: request.headers,
                url: request.url,
                cf: request.cf,
                params: {},
                query: {},
                body: ''
            };
            if (req.method === 'OPTIONS' && Object.keys(this.corsConfig).length) {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': this.corsConfig.allowOrigin,
                        'Access-Control-Allow-Methods': this.corsConfig.allowMethods,
                        'Access-Control-Allow-Headers': this.corsConfig.allowHeaders,
                        'Access-Control-Max-Age': this.corsConfig.maxAge.toString()
                    },
                    status: this.corsConfig.optionsSuccessStatus
                });
            }
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                if (req.headers.has('Content-Type') && req.headers.get('Content-Type').includes('json')) {
                    try {
                        req.body = await request.json();
                    }
                    catch {
                        req.body = {};
                    }
                }
                else {
                    try {
                        req.body = await request.text();
                    }
                    catch {
                        req.body = '';
                    }
                }
            }
            const route = this.getRoute(req);
            if (!route)
                return new Response(this.debugMode ? 'Route not found!' : null, { status: 404 });
            const res = { headers: new Headers() };
            if (Object.keys(this.corsConfig).length) {
                res.headers.set('Access-Control-Allow-Origin', this.corsConfig.allowOrigin);
                res.headers.set('Access-Control-Allow-Methods', this.corsConfig.allowMethods);
                res.headers.set('Access-Control-Allow-Headers', this.corsConfig.allowHeaders);
                res.headers.set('Access-Control-Max-Age', this.corsConfig.maxAge.toString());
            }
            const handlers = [...this.globalHandlers, ...route.handlers];
            let prevIndex = -1;
            const runner = async (index) => {
                if (index === prevIndex)
                    throw new Error('next() called multiple times');
                prevIndex = index;
                if (typeof handlers[index] === 'function')
                    await handlers[index]({ env, req, res, next: async () => await runner(index + 1) });
            };
            await runner(0);
            if (typeof res.body === 'object') {
                if (!res.headers.has('Content-Type'))
                    res.headers.set('Content-Type', 'application/json');
                res.body = JSON.stringify(res.body);
            }
            if (res.raw)
                return res.raw;
            return new Response([101, 204, 205, 304].includes(res.status || (res.body ? 200 : 204)) ? null : res.body, { status: res.status, headers: res.headers, webSocket: res.webSocket || null });
        }
        catch (err) {
            console.error(err);
            return new Response(this.debugMode && err instanceof Error ? err.stack : '', { status: 500 });
        }
    }
}
exports.default = Router;
