import { describe, expect, test } from '@jest/globals'
import { Router } from '.'

describe('Router', () => {
	test('use', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/')
		const testResponse = new Response('success', { status: 200 })

		expect(router.use(() => testResponse)).toBeInstanceOf(Router)

		router.get('/', () => new Response('failed'))

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('delete', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'DELETE' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.delete('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('get', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'GET' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.get('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('head', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'HEAD' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.head('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('options', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'OPTIONS' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.options('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('patch', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'PATCH' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.patch('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('post', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'POST' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.post('/test', () => testResponse)).toBeInstanceOf(Router)
		expect(router.post('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('put', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'PUT' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.put('/test', () => testResponse)).toBeInstanceOf(Router)
		expect(router.put('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('any', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'POST' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.any('/test', () => testResponse)).toBeInstanceOf(Router)
		expect(router.any('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('cors', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'GET' })
		const testOptionsRequest = new Request('https://example.com/', { method: 'OPTIONS' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.cors()).toBeInstanceOf(Router)

		router.get('/', () => testResponse)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
		expect(response.headers.get('Access-Control-Allow-Methods')).toBe('*')
		expect(response.headers.get('Access-Control-Allow-Headers')).toBe('*')
		expect(response.headers.get('Access-Control-Allow-Credentials')).toBe(null)
		expect(response.headers.get('vary')).toBe(null)
		expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')

		const optionsRes = await router.handle(testOptionsRequest, {})

		expect(optionsRes.status).toBe(204)
		expect(optionsRes.headers.get('Access-Control-Allow-Origin')).toBe('*')
		expect(optionsRes.headers.get('Access-Control-Allow-Methods')).toBe('*')
		expect(optionsRes.headers.get('Access-Control-Allow-Headers')).toBe('*')
		expect(optionsRes.headers.get('Access-Control-Allow-Credentials')).toBe(null)
		expect(optionsRes.headers.get('vary')).toBe(null)
		expect(optionsRes.headers.get('Access-Control-Max-Age')).toBe('86400')

		expect(await response.text()).toBe('success')
	})

	//test('getRoute', async () => {
	//	const router = new Router()
	//	const testRequest = new Request('https://example.com/', { method: 'GET' })
	//	const testResponse = new Response('https://example.com/', { status: 200 })
	//	const testHandler = () => testResponse

	//	expect(router.cors()).toBeInstanceOf(Router)

	//	router.get('/', testHandler)

	//	const response = await router.handle(testRequest, {})

	//	expect(response.status).toBe(200)
	//})

	test('params', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/bar/foo')

		router.get('/:foo/:bar', ({ req }) => {
			return Response.json(req.params)
		})

		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(200)

		expect(await response.json()).toMatchObject({ foo: 'bar', bar: 'foo' })
	})

	test('query', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/?foo=bar&bar=foo')

		router.get('/', ({ req }) => {
			return Response.json(req.query)
		})

		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(200)

		expect(await response.json()).toMatchObject({ foo: 'bar', bar: 'foo' })
	})

	test('wildcard', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/foo/bar')
		const testResponse = new Response('success', { status: 200 })

		router.get('*', () => testResponse)

		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(200)

		expect(await response.text()).toBe('success')
	})

	test('bearer', async () => {
		const router = new Router()
		const testToken = 'super-secret-token'
		const testRequest = new Request('https://example.com/', { headers: { 'Authorization': `Bearer ${testToken}` }})

		router.get('/', ({ req }) => new Response(req.bearer()))

		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(200)

		expect(await response.text()).toBe(testToken)
	})

})

describe('Middleware', () => {
	const router = new Router()
	const testHandlerSuccess = () => new Response('success', { status: 200 })
	const testHandlerContinue = () => {}
	const testHandlerFailed = () => new Response('failed', { status: 403 })

	router.get('/success', testHandlerContinue, testHandlerSuccess)
	router.get('/failed', testHandlerFailed, testHandlerSuccess)

	test('continue', async () => {
		const testRequest = new Request('https://example.com/success')
		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(200)

		expect(await response.text()).toBe('success')
	})

	test('block', async () => {
		const testRequest = new Request('https://example.com/failed')
		const response = await router.handle(testRequest, {})

		expect(response.status).toEqual(403)

		expect(await response.text()).toBe('failed')
	})
})

describe('Body', () => {
	test('text then json', async () => {
		const router = new Router()
		const testObject = { text: 'cloudflare-worker-router', binary: true, amount: 17 }
		const testJson = JSON.stringify(testObject)
		const testRequest = new Request('https://example.com/', { method: 'POST', body: testJson })

		router.post('/', async ({ req }) => {
			return Response.json({
				text: await req.text(),
				json: await req.json()
			})
		})

		const response = await router.handle(testRequest, {})

		expect(await response.json()).toMatchObject({ text: testJson, json: testObject })
	})

	test('json then text', async () => {
		const router = new Router()
		const testObject = { text: 'cloudflare-worker-router', binary: true, amount: 17 }
		const testJson = JSON.stringify(testObject)
		const testRequest = new Request('https://example.com/', { method: 'POST', body: testJson })

		router.post('/', async ({ req }) => {
			return Response.json({
				json: await req.json(),
				text: await req.text()
			})
		})

		const response = await router.handle(testRequest, {})

		expect(await response.json()).toMatchObject({ text: testJson, json: testObject })
	})
})