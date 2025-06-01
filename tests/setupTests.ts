import '@testing-library/jest-dom'
import * as jsdom from 'jsdom'

// Add missing web APIs required for tests
const dom = new jsdom.JSDOM()
global.document = dom.window.document
global.window = dom.window as unknown as Window & typeof globalThis
