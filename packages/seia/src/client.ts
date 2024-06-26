// sort-imports-ignore
import './process-polyfill.js'
import './webpack-global.js'

import { type ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createFromReadableStream } from 'react-server-dom-webpack/client.browser'

import { parseAnchorId } from './utils.js'

export const initClientModuleMap = (
	clientModuleMap: Record<string, Record<string, unknown>>,
) => {
	const lookup = (id: string) => {
		const { path, anchor } = parseAnchorId(id)

		return anchor ? clientModuleMap[path][anchor] : clientModuleMap[path]
	}

	globalThis.__webpack_chunk_load__ = async (id: string) => lookup(id)
	globalThis.__webpack_require__ = (id: string) => lookup(id)
}

export const run = async () => {
	const embeddedStream = new Blob([globalThis.__SEIA_RSC_PAYLOAD], {
		type: 'text/plain',
	}).stream()
	const reactRootDom = (await createFromReadableStream(
		embeddedStream,
	)) as ReactNode

	const root = document.getElementById('root')
	if (!root) throw new Error('Root element not found')

	hydrateRoot(root, reactRootDom)
}
