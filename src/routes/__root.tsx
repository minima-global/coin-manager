import Header from "@/components/layout/header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Header />
        <div className="lg:mt-[28px] lg:max-w-[650px] w-full p-4 rounded-lg sm:container sm:mx-auto">
          <Outlet />
        </div>
        {import.meta.env.MODE === "development" ? (
          <TanStackRouterDevtools />
        ) : null}
      </>
    );
  },
});
