import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/tokens/")({
  component: () => <div>Tokens</div>,
})
