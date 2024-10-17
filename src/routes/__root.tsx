import ModeToggle from "@/components/mode-toggle"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 justify-between items-center">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <ModeToggle />
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
