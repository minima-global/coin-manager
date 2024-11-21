import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/info/")({
  component: Info,
})

function Info() {
  return (
    <div className="flex flex-col gap-4 mt-36 justify-center items-center">
      <h1 className="text-3xl font-semibold mb-8">Minima Coin Manager</h1>
      <div className="flex flex-col gap-4 w-full">
        <p className="text-primary text-base">
          The Coin Manager app helps you efficiently organize your coins (or
          UTXOs - Unspent Transaction Outputs) by consolidating or splitting
          them as needed.
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-primary">
            Consolidating Coins
          </span>{" "}
          combines multiple small coins into larger ones. This is essential for
          preventing “dust” - lots of tiny coins that clutter your wallet.
          Consolidation helps streamline your transactions and improve
          performance.
        </p>
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-primary">Splitting</span> breaks
          down larger coins into smaller amounts. This ensures you have multiple
          coins available for transactions, improving convenience and usability.
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
      >
        <Link to="/">Get Started</Link>
      </Button>
    </div>
  )
}
