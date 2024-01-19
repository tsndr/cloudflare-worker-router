/**
* Route Object
*
* @typedef Route
* @property {string} method HTTP request method
* @property {string} url URL String
* @property {RouterHandler[]} handlers Array of handler functions
*/
export type Route<Env, CtxExt, ReqExt> = {
	method: string
	url: string
	handlers: RouterHandler<Env, CtxExt, ReqExt>[]
}

/**
* Router Context
*
* @typedef RouterContext
* @property {RouterEnv} env Environment
* @property {RouterRequest} req Request Object
* @property {ExecutionContext} ctx Context Object
*/
export type RouterContext<Env = any, CtxExt = {}, ReqExt = {}> = CtxExt & {
	env: Env
	req: RouterRequest<ReqExt>
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
export type RouterRequest<ReqExt> = ReqExt & {
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
	bearer(): string | undefined
	cf?: IncomingRequestCfProperties
}

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
export type RouterHandler<Env = any, CtxExt = {}, ReqExt = {}> = {
	(ctx: RouterContext<Env, CtxExt, ReqExt>): Promise<Response | void> | Response | void
}

/**
* CORS Config
*
* @typedef RouterCorsConfig
* @property {string} [allowOrigin="*"] Access-Control-Allow-Origin (default: `*`)
* @property {string} [allowMethods="*"] Access-Control-Allow-Methods (default: `*`)
* @property {string} [allowHeaders="*"] Access-Control-Allow-Headers (default: `*`)
* @property {boolean} [allowCredentials="true"] Access-Control-Allow-Credentials (default: undefined)
* @property {string} [vary="origin"] vary (default: undefined)
* @property {number} [maxAge=86400] Access-Control-Max-Age (default: `86400`)
* @property {number} [optionsSuccessStatus=204] Return status code for OPTIONS request (default: `204`)
*/
export type RouterCorsConfig = {
	allowOrigin?: string
	allowMethods?: string
	allowHeaders?: string
	allowCredentials?: boolean
	vary?: string
	maxAge?: number
	optionsSuccessStatus?: number
}

export type RouterBuffer = {
	arrayBuffer?: ArrayBuffer
	text?: string
	json?: any
	formData?: FormData
	blob?: Blob
}

/**
* Router
*
* @public
* @class
*/
export class Router<Env = any, CtxExt = {}, ReqExt = {}> {

	/**
	* Router Array
	*
	* @protected
	* @type {Route[]}
	*/
	protected routes: Route<Env, CtxExt, ReqExt>[] = []

	/**
	* Global Handlers
	*
	* @protected
	* @type {RouterHandler[]}
	*/
	protected globalHandlers: RouterHandler<Env, CtxExt, ReqExt>[] = []

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
	public use(...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		for (let handler of handlers) {
			this.globalHandlers.push(handler)
		}
		return this
	}

	/**
	* Register DELETE route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public delete(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('DELETE', url, handlers)
	}

	/**
	* Register GET route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public get(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('GET', url, handlers)
	}

	/**
	* Register HEAD route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public head(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('HEAD', url, handlers)
	}

	/**
	* Register OPTIONS route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public options(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('OPTIONS', url, handlers)
	}

	/**
	* Register PATCH route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public patch(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('PATCH', url, handlers)
	}

	/**
	* Register POST route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public post(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('POST', url, handlers)
	}

	/**
	* Register PUT route
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public put(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('PUT', url, handlers)
	}

	/**
	* Register route, ignoring method
	*
	* @param {string} url
	* @param  {RouterHandler[]} handlers
	* @returns {Router}
	*/
	public any(url: string, ...handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
		return this.register('*', url, handlers)
	}

	/**
	* Debug Mode
	*
	* @param {boolean} [state=true] Whether to turn on or off debug mode (default: true)
	* @returns {Router}
	*/
	public debug(state: boolean = true): Router<Env, CtxExt, ReqExt> {
		this.debugMode = state
		return this
	}

	/**
	* Enable CORS support
	*
	* @param {RouterCorsConfig} [config]
	* @returns {Router}
	*/
	public cors(config?: RouterCorsConfig): Router<Env, CtxExt, ReqExt> {
		this.corsEnabled = true
		this.corsConfig = {
			allowOrigin: config?.allowOrigin ?? '*',
			allowMethods: config?.allowMethods ?? '*',
			allowHeaders: config?.allowHeaders ?? '*',
			allowCredentials: config?.allowCredentials ?? undefined,
			vary: config?.vary ?? undefined,
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
		if (this.corsConfig.allowCredentials && !headers.has('Access-Control-Allow-Credentials'))
			headers.set('Access-Control-Allow-Credentials', this.corsConfig.allowCredentials.toString())
		if (this.corsConfig.vary && !headers.has('vary'))
			headers.set('vary', this.corsConfig.vary.toString())
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
	private register(method: string, url: string, handlers: RouterHandler<Env, CtxExt, ReqExt>[]): Router<Env, CtxExt, ReqExt> {
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
	private getRoute(request: RouterRequest<ReqExt>): Route<Env, CtxExt, ReqExt> | undefined {
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
	* @param {Env} env
	* @param {CtxExt} [ctxExt]
	* @param {ReqExt} [reqExt]
	* @returns {Promise<Response>}
	*/
	public async handle(request: Request, env: Env, ctx?: ExecutionContext, ctxExt?: CtxExt, reqExt?: ReqExt): Promise<Response> {
		const buffer: RouterBuffer = {}
		const req = {
			...(reqExt ?? {}),
			method: request.method,
			headers: request.headers,
			url: request.url,
			cf: request.cf,
			raw: request,
			params: {},
			query: {},
			arrayBuffer: async (): Promise<ArrayBuffer> => buffer.arrayBuffer ? buffer.arrayBuffer : buffer.arrayBuffer = await request.clone().arrayBuffer(),
			text: async (): Promise<string> => buffer.text ? buffer.text : buffer.text = await request.clone().text(),
			json: async <T>(): Promise<T> => buffer.json ? buffer.json : buffer.json = await request.clone().json<T>(),
			formData: async (): Promise<FormData> => buffer.formData ? buffer.formData : buffer.formData = await request.clone().formData(),
			blob: async (): Promise<Blob> => buffer.blob ? buffer.blob : buffer.blob = await request.clone().blob(),
			bearer: () => request.headers.get('Authorization')?.replace(/^(B|b)earer /, '').trim()
		} as RouterRequest<ReqExt>

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
			const context = {
				...(ctxExt ?? {}),
				env,
				req,
				dbg,
				ctx
			} as RouterContext<Env, CtxExt, ReqExt>

			const res = await handler(context)

			if (res) {
				response = res
				break
			}
		}

		if (!response)
			return new Response(this.debugMode ? 'Handler did not return a Response!' : null, { status: 404 })

		if (this.corsEnabled) {
			response = new Response(response.body, response)
			this.setCorsHeaders(response.headers)
		}

		return response
	}
}