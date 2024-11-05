import ModeToggle from "@/components/mode-toggle"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { History, Home } from "lucide-react"

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="border-b border-muted mt-4 pb-2 px-4">
          <div className="flex gap-2 container mx-auto max-w-2xl ">
            <div className="flex gap-4 relative justify-between w-full">
              <div className="flex gap-2">
                <div className="relative p-2 rounded-lg transition-all duration-300 ease-in-out group  text-center hover:bg-muted justify-between w-fit">
                  <Link
                    to="/"
                    className="[&.active]:font-medium [&.active]:text-foreground text-muted-foreground group-hover:text-foreground relative z-10 block text-sm transition-all duration-300 ease-in-out"
                  >
                    <Home className="h-6 w-6" />
                  </Link>
                </div>
                <div className="relative p-2 rounded-lg transition-all duration-300 ease-in-out group  text-center hover:bg-muted justify-between w-fit">
                  <Link
                    to="/"
                    className="[&.active]:font-medium [&.active]:text-foreground text-muted-foreground group-hover:text-foreground relative z-10 block text-sm transition-all duration-300 ease-in-out"
                  >
                    <History className="h-6 w-6" />
                  </Link>
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-full mt-10 pb-10 px-4">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </>
    )
  },
})
