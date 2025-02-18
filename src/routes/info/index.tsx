import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/info/")({
  component: Info,
});

function Info() {
  return (
    <div className="flex flex-col gap-4 mt-36 justify-center items-center">
      <h1 className="text-3xl font-semibold mb-8">Minima Coin Manager</h1>
      <div className="flex flex-col gap-4 w-full">
        <p className="text-primary text-base max-w-xl">
          The Coin Manager app helps you organize your coins, or UTxOs (Unspent
          Transaction Outputs) by consolidating or splitting them as needed.
        </p>
        <p className=" text-muted-foreground text-sm max-w-xl">
          Your wallet balance is made up of multiple coins just like cash, and
          coins can vary in amount. Coins of small value are known as 'dust' and
          they can clutter your wallet and reduce node performance.
        </p>
        <p className="text-muted-foreground text-sm max-w-xl">
          <span className="font-semibold text-primary">Consolidate Coins</span>{" "}
          to combine smaller coins and prevent dust, improving node performance
          and streamlining transactions.
        </p>
        <p className="text-muted-foreground text-sm max-w-xl">
          <span className="font-semibold text-primary">Split Coins</span> to
          break large value coins into smaller amounts. This ensures you have
          multiple coins available for transactions, improving convenience and
          usability.
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
      >
        <Link to="/">Get Started</Link>
      </Button>
    </div>
  );
}
