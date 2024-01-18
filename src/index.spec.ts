import { describe, expect, test } from '@jest/globals'
import { Router } from '.'

describe('Router', () => {
	test('Router.use', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/')
		const testResponse = new Response('success', { status: 200 })
		const testHandler = () => testResponse

		expect(router.use(testHandler)).toBeInstanceOf(Router)

		router.get('/', () => new Response('failed'))

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await response.text()).toBe('success')
	})

	test('Router.delete', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'DELETE' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.delete('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.get', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'GET' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.get('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.head', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'HEAD' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.head('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.options', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'OPTIONS' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.options('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.patch', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'PATCH' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.patch('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.post', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'POST' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.post('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.put', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'PUT' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.put('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.any', async () => {
		const router = new Router()
		const testRequest = new Request('https://example.com/', { method: 'POST' })
		const testResponse = new Response('success', { status: 200 })

		expect(router.any('/', () => testResponse)).toBeInstanceOf(Router)

		const response = await router.handle(testRequest, {})

		expect(response.status).toBe(200)

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

	test('Router.cors', async () => {
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

		expect(await (await router.handle(testRequest, {})).text()).toBe('success')
	})

})