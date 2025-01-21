import { useMinima } from "@/hooks/use-minima";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CoinCard } from "@/components/tokens/token-card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Coins, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/tokens/$tokenId/info")({
  component: Info,
});

function Info() {
  const { tokenId } = Route.useParams();
  const { addresses } = useMinima();
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const addressesQuery = addresses(tokenId, showAllCoins);

  // Sort addresses so ones with coins appear first
  const sortedAddresses = useMemo(() => {
    if (!addressesQuery.data) return [];

    return Object.entries(addressesQuery.data)
      .map(([addr, addrCoins]) => {
        const addressCoinsForToken = addrCoins?.response.filter(
          (coin) => coin.tokenid === tokenId
        );
        
        const totalAmount =
          addressCoinsForToken?.reduce(
            (sum, coin) => sum + Number(coin.tokenamount || coin.amount),
            0
          ) || 0;
        const hasCoins = Boolean(addressCoinsForToken?.length);

        return {
          addr,
          addrCoins,
          addressCoinsForToken,
          totalAmount,
          hasCoins,
        };
      })
      .sort((a, b) => {
        // Sort by hasCoins first (true comes before false)
        if (a.hasCoins !== b.hasCoins) {
          return a.hasCoins ? -1 : 1;
        }
        // If both have coins, sort by amount (highest first)
        if (a.hasCoins && b.hasCoins) {
          return b.totalAmount - a.totalAmount;
        }
        return 0;
      });
  }, [addressesQuery.data, tokenId]);

  const addressesWithCoins = sortedAddresses.filter((addr) => addr.hasCoins);
  const totalTokenAmount = addressesWithCoins.reduce(
    (sum, addr) => sum + addr.totalAmount,
    0
  );

  return (
    <div className="p-4 md:p-3">
      <h1 className="text-2xl md:text-xl font-bold mb-4">Token Info</h1>

      <div className="flex flex-col space-y-4 md:space-y-2 mb-6">
        <p className="text-sm md:text-xs text-muted-foreground">
          View and manage coins for token {tokenId}. Toggle between all coins and spendable coins.
        </p>
        
        <div className="flex items-center justify-start space-x-4 bg-grey10 dark:bg-darkContrast rounded-lg p-3">
          <Switch
            id="show-all-coins"
            checked={showAllCoins}
            onCheckedChange={setShowAllCoins}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="show-all-coins" className="text-sm flex items-center gap-2">
            {showAllCoins ? (
              <>
                <Coins className="h-4 w-4" />
                <span>Showing All Coins</span>
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                <span>Showing Spendable Coins</span>
              </>
            )}
          </Label>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-6 md:mb-4">
        <h2 className="text-lg md:text-base font-semibold mb-3 md:mb-2">
          Overview
        </h2>
        <div className="bg-grey10 dark:bg-darkContrast rounded-lg p-4 md:p-3">
          <div className="flex justify-between items-center mb-3 md:mb-2">
            <span className="text-sm md:text-xs text-muted-foreground">
              Total amount across all addresses:
            </span>
            <span className="font-mono font-medium">{totalTokenAmount}</span>
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-2 md:gap-1.5">
            {addressesWithCoins.map(({ addr, totalAmount }) => (
              <div key={addr} className="contents">
                <span className="font-mono text-sm md:text-xs truncate">
                  {addr}
                </span>
                <span className="font-mono text-sm md:text-xs text-right">
                  {totalAmount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm md:text-xs text-muted-foreground mb-4 md:mb-2">
        {sortedAddresses.length} addresses with coins for {tokenId}
      </p>
      <div className="flex flex-col gap-2 md:gap-1.5">
        {sortedAddresses.map(
          ({ addr, addressCoinsForToken, totalAmount, hasCoins }) => (
            <div
              key={addr}
              className="bg-grey10 dark:bg-darkContrast rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  hasCoins &&
                  setExpandedAddress(expandedAddress === addr ? null : addr)
                }
                className={`w-full p-4 md:p-3 flex items-center justify-between ${hasCoins ? "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 md:gap-1.5">
                    <span className="font-medium text-primary py-[2px] px-2 dark:bg-[#18181b] bg-[#ebebeb] text-sm md:text-xs">
                      Address:
                    </span>
                    <span className="font-mono text-sm md:text-xs truncate">
                      {addr}
                    </span>
                  </div>
                  <div className="mt-2 md:mt-1.5 flex items-center gap-2 md:gap-1.5">
                    <span className="font-medium text-primary py-[2px] px-2 dark:bg-[#18181b] bg-[#ebebeb] text-sm md:text-xs">
                      Total Amount:
                    </span>
                    <span className="font-mono text-sm md:text-xs">
                      {totalAmount}
                    </span>
                  </div>
                  {!hasCoins && (
                    <p className="mt-2 md:mt-1.5 text-sm md:text-xs text-muted-foreground">
                      This address has no coins for this token
                    </p>
                  )}
                </div>
                {hasCoins &&
                  (expandedAddress === addr ? (
                    <ChevronUp className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
                  ))}
              </button>

              <AnimatePresence>
                {expandedAddress === addr && hasCoins && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border p-4 md:p-3 space-y-2 md:space-y-1.5">
                      {addressCoinsForToken?.map((coin) => (
                        <CoinCard
                          key={coin.coinid}
                          coin={coin}
                          isSelected={false}
                          onSelect={() => {}}
                          mode="untrack"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        )}
      </div>
    </div>
  );
}
