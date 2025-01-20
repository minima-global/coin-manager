/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as TokensIndexImport } from './routes/tokens/index'
import { Route as InfoIndexImport } from './routes/info/index'
import { Route as CointrackIndexImport } from './routes/cointrack/index'
import { Route as TokensTokenIdImport } from './routes/tokens/$tokenId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TokensIndexRoute = TokensIndexImport.update({
  id: '/tokens/',
  path: '/tokens/',
  getParentRoute: () => rootRoute,
} as any)

const InfoIndexRoute = InfoIndexImport.update({
  id: '/info/',
  path: '/info/',
  getParentRoute: () => rootRoute,
} as any)

const CointrackIndexRoute = CointrackIndexImport.update({
  id: '/cointrack/',
  path: '/cointrack/',
  getParentRoute: () => rootRoute,
} as any)

const TokensTokenIdRoute = TokensTokenIdImport.update({
  id: '/tokens/$tokenId',
  path: '/tokens/$tokenId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/tokens/$tokenId': {
      id: '/tokens/$tokenId'
      path: '/tokens/$tokenId'
      fullPath: '/tokens/$tokenId'
      preLoaderRoute: typeof TokensTokenIdImport
      parentRoute: typeof rootRoute
    }
    '/cointrack/': {
      id: '/cointrack/'
      path: '/cointrack'
      fullPath: '/cointrack'
      preLoaderRoute: typeof CointrackIndexImport
      parentRoute: typeof rootRoute
    }
    '/info/': {
      id: '/info/'
      path: '/info'
      fullPath: '/info'
      preLoaderRoute: typeof InfoIndexImport
      parentRoute: typeof rootRoute
    }
    '/tokens/': {
      id: '/tokens/'
      path: '/tokens'
      fullPath: '/tokens'
      preLoaderRoute: typeof TokensIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/tokens/$tokenId': typeof TokensTokenIdRoute
  '/cointrack': typeof CointrackIndexRoute
  '/info': typeof InfoIndexRoute
  '/tokens': typeof TokensIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/tokens/$tokenId': typeof TokensTokenIdRoute
  '/cointrack': typeof CointrackIndexRoute
  '/info': typeof InfoIndexRoute
  '/tokens': typeof TokensIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/tokens/$tokenId': typeof TokensTokenIdRoute
  '/cointrack/': typeof CointrackIndexRoute
  '/info/': typeof InfoIndexRoute
  '/tokens/': typeof TokensIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/tokens/$tokenId' | '/cointrack' | '/info' | '/tokens'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/tokens/$tokenId' | '/cointrack' | '/info' | '/tokens'
  id:
    | '__root__'
    | '/'
    | '/tokens/$tokenId'
    | '/cointrack/'
    | '/info/'
    | '/tokens/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  TokensTokenIdRoute: typeof TokensTokenIdRoute
  CointrackIndexRoute: typeof CointrackIndexRoute
  InfoIndexRoute: typeof InfoIndexRoute
  TokensIndexRoute: typeof TokensIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  TokensTokenIdRoute: TokensTokenIdRoute,
  CointrackIndexRoute: CointrackIndexRoute,
  InfoIndexRoute: InfoIndexRoute,
  TokensIndexRoute: TokensIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/tokens/$tokenId",
        "/cointrack/",
        "/info/",
        "/tokens/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/tokens/$tokenId": {
      "filePath": "tokens/$tokenId.tsx"
    },
    "/cointrack/": {
      "filePath": "cointrack/index.tsx"
    },
    "/info/": {
      "filePath": "info/index.tsx"
    },
    "/tokens/": {
      "filePath": "tokens/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
