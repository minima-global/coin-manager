import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tokens/")({
  beforeLoad: () => {
    return redirect({ to: "/" });
  },
});
