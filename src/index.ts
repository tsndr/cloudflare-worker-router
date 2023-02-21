/**
* Route Object
*
* @typedef Route
* @property {string} method HTTP request method
* @property {string} url URL String
* @property {RouterHandler[]} handlers Array of handler functions
*/
export type Route<TEnv, TExt> = {
	method: string
	url: string
	handlers: RouterHandler<TEnv, TExt>[]
}

/**
* Router Context
*
* @typedef RouterContext
* @property {RouterEnv} env Environment
* @property {RouterRequest} req Request Object
* @property {ExecutionContext} ctx Context Object
*/
export type RouterContext<TEnv = any, TExt = any> = {
	env: TEnv
	req: RouterRequest<TExt>
	dbg: boolean
	ctx?: ExecutionContext
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
* @property {Request} raw Raw Request Object
* @property {IncomingRequestCfProperties} [cf] object containing custom Cloudflare properties. (https://developers.cloudflare.com/workers/examples/accessing-the-cloudflare-object)
*/
export type RouterRequest<TExt> = {
	url: string
	method: string
	params: RouterRequestParams
	query: RouterRequestQuery
	headers: Headers
	raw: Request
	arrayBuffer(): Promise<ArrayBuffer>
	text(): Promise<string>
	json<T>(): Promise<T>
	formData(): Promise<FormData>
	blob(): Promise<Blob>
	bearer: () => string
	cf?: IncomingRequestCfProperties
} & TExt

/**
* Request Parameters
*
* @typedef RouterRequestParams
*/
export type RouterRequestParams = {
	[key: string]: string
}

/**
* Request Query
*
* @typedef RouterRequestQuery
*/
export type RouterRequestQuery = {
	[key: string]: string
}

/**
* Handler Function
*
* @callback RouterHandler
* @param {RouterContext} ctx
* @returns {Promise<Response | void> Response | void}
*/
export type RouterHandler<TEnv = any, TExt = any> = {
	(ctx: RouterContext<TEnv, TExt>): Promise<Response | void> | Response | void
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
export type RouterCorsConfig = {
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
export class Router<TEnv = any, TExt = any> {

	/**
	* Router Array
	*
	* @protected
	* @type {Route[]}
	*/
	protected routes: Route<TEnv, TExt>[] = []

	/**
	* Global Handlers
	*
	* @protected
	* @type {RouterHandler[]}
	*/
	protected globalHandlers: RouterHandler<TEnv, TExt>[] = []

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
	*
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
	public use(...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
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
	public connect(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('CONNECT', url, handlers)
	}

	/**
	* Register DELETE route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public delete(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('DELETE', url, handlers)
	}

	/**
	* Register GET route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public get(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('GET', url, handlers)
	}

	/**
	* Register HEAD route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public head(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('HEAD', url, handlers)
	}

	/**
	* Register OPTIONS route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public options(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('OPTIONS', url, handlers)
	}

	/**
	* Register PATCH route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public patch(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('PATCH', url, handlers)
	}

	/**
	* Register POST route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public post(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('POST', url, handlers)
	}

	/**
	* Register PUT route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public put(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('PUT', url, handlers)
	}

	/**
	* Register TRACE route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public trace(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('TRACE', url, handlers)
	}

	/**
	* Register route, ignoring method
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public any(url: string, ...handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
		return this.register('*', url, handlers)
	}

	/**
	* Debug Mode
	*
	* @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
	* @returns {Router}
	*/
	public debug(state: boolean = true): Router<TEnv, TExt> {
		this.debugMode = state
		return this
	}

	/**
	* Enable CORS support
	*
	* @param {RouterCorsConfig} [config]
	* @returns {Router}
	*/
	public cors(config?: RouterCorsConfig): Router<TEnv, TExt> {
		this.corsEnabled = true
		this.corsConfig = {
			allowOrigin: config?.allowOrigin ?? '*',
			allowMethods: config?.allowMethods ?? '*',
			allowHeaders: config?.allowHeaders ?? '*',
			maxAge: config?.maxAge ?? 86400,
			optionsSuccessStatus: config?.optionsSuccessStatus ?? 204
		}
		return this
	}

	private setCorsHeaders(headers: Headers = new Headers()): Headers {
		if (this.corsConfig.allowOrigin && !headers.has('Access-Control-Allow-Origin'))
			headers.set('Access-Control-Allow-Origin', this.corsConfig.allowOrigin)
		if (this.corsConfig.allowMethods && !headers.has('Access-Control-Allow-Methods'))
			headers.set('Access-Control-Allow-Methods', this.corsConfig.allowMethods)
		if (this.corsConfig.allowHeaders && !headers.has('Access-Control-Allow-Headers'))
			headers.set('Access-Control-Allow-Headers', this.corsConfig.allowHeaders)
		if (this.corsConfig.maxAge && !headers.has('Access-Control-Max-Age'))
			headers.set('Access-Control-Max-Age', this.corsConfig.maxAge.toString())
		return headers
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
	private register(method: string, url: string, handlers: RouterHandler<TEnv, TExt>[]): Router<TEnv, TExt> {
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
	private getRoute(request: RouterRequest<TExt>): Route<TEnv, TExt> | undefined {
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
	* @param {Request} request
	* @param {TEnv} env
	* @param {TExt} [ext]
	* @returns {Promise<Response>}
	*/
	public async handle(request: Request, env: TEnv, ctx?: ExecutionContext, ext?: TExt): Promise<Response> {
		const req = {
			...(ext ?? {}),
			method: request.method,
			headers: request.headers,
			url: request.url,
			cf: request.cf,
			raw: request,
			params: {},
			query: {},
			arrayBuffer: (): Promise<ArrayBuffer> => request.arrayBuffer(),
			text: (): Promise<string> => request.text(),
			json: <T>(): Promise<T> => request.json<T>(),
			formData: (): Promise<FormData> => request.formData(),
			blob: (): Promise<Blob> => request.blob(),
			bearer: () => request.headers.get('Authorization')?.replace(/^(B|b)earer /, '').trim() ?? '',
		} as RouterRequest<TExt>

		if (this.corsEnabled && req.method === 'OPTIONS') {
			return new Response(null, {
				headers: this.setCorsHeaders(),
				status: this.corsConfig.optionsSuccessStatus
			})
		}

		const route = this.getRoute(req)

		if (!route)
			return new Response(this.debugMode ? 'Route not found!' : null, { status: 404 })

		const handlers = [...this.globalHandlers, ...route.handlers]
		const dbg = this.debugMode

		let response: Response | undefined

		for (const handler of handlers) {
			const res = await handler({ env, req, dbg, ctx })

			if (res) {
				response = res
				break
			}
		}

		if (!response)
			return new Response(this.debugMode ? 'Handler did not return a Response!' : null, { status: 404 })

		if (this.corsEnabled)
			this.setCorsHeaders(response.headers)

		return response
	}
}
