import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import AppProvider from "./AppContext.tsx"
import { MDS } from "@minima-global/mds"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { routeTree } from "./routeTree.gen"
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { ThemeProvider } from "./components/theme-provider.tsx"

// Debug mode
if (import.meta.env.MODE === "development") {
  MDS.DEBUG_HOST = import.meta.env.VITE_DEBUG_HOST
  MDS.DEBUG_PORT = parseInt(import.meta.env.VITE_DEBUG_MDS_PORT)
  MDS.DEBUG_MINIDAPPID = import.meta.env.VITE_DEBUG_UID
}

const history = createHashHistory()

// Create a new router instance
const router = createRouter({ routeTree, history })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={client}>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
