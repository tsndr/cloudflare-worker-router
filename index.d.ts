export = Router
declare class Router {
    protected routes: Route[]
    protected corsConfig: RouterCorsConfig
    connect(url: string, ...handlers: RouterHandler[]): Router
    delete(url: string, ...handlers: RouterHandler[]): Router
    get(url: string, ...handlers: RouterHandler[]): Router
    head(url: string, ...handlers: RouterHandler[]): Router
    options(url: string, ...handlers: RouterHandler[]): Router
    patch(url: string, ...handlers: RouterHandler[]): Router
    post(url: string, ...handlers: RouterHandler[]): Router
    put(url: string, ...handlers: RouterHandler[]): Router
    trace(url: string, ...handlers: RouterHandler[]): Router
    any(url: string, ...handlers: RouterHandler[]): Router
    all(url: string, ...handlers: RouterHandler[]): Router
    cors(config: RouterCorsConfig): Router
    private register(method: string, url: string, handlers: RouteHandler[]): Router
    private getRoute(request: Request): Route | undefined
    handle(event: Event): Response
}
declare namespace Router {
    export { Route, RouterRequest, RouterResponse, RouterNext, RouterHandler, RouterCorsConfig }
}
type Route = {
    method: string
    url: string
    handlers: RouterHandler[]
}
type RouterCorsConfig = {
    allowOrigin: string
    allowMethods: string
    allowHeaders: string
    maxAge: number
    optionsSuccessStatus: number
}
type RouterHandler = (request: Request, response: Response, next: RouterNext) => any
type RouterRequest = {
    method: string
    params: {
        [x: string]: string
    }
    headers: {
        [x: string]: string
    }
    body: {
        [x: string]: string
    } | string
}
type RouterResponse = {
    headers: {
        [x: string]: string
    }
    status: number
    body: {
        [x: string]: string
    } | string
}
type RouterNext = () => Promise<any>