import { TrackCoins } from "@/components/cointrack/coin-track";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cointrack/")({
  component: Cointrack,
});

function Cointrack() {
  return (
    <div className="container mx-auto max-w-2xl flex flex-col gap-4">
      <h1 className="text-3xl font-semibold mb-8">Track Coins</h1>
      <p className="text-muted-foreground text-sm max-w-xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos dolor
        quaerat dolores laborum quia repellendus at nobis enim modi temporibus?
        Consequuntur voluptatem similique ut in totam nobis possimus earum
        praesentium?
      </p>
      <TrackCoins />
    </div>
  );
}
