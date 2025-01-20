import { Coin } from "@minima-global/mds";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { formatTokenAmount } from "@/lib/format-token";
import { ArrowLeft, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Virtuoso } from "react-virtuoso";

interface SearchCoinsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearch: (value: string) => void;
  coins: Coin[];
  onUntrack?: (coinId: string) => void;
}

export function SearchCoinsDialog({
  open,
  onOpenChange,
  searchQuery,
  onSearch,
  coins,
  onUntrack,
}: SearchCoinsDialogProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [statusMessage, setStatusMessage] = useState<"loading" | "all" | null>(
    null
  );
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [_, setPendingCoins] = useState<Coin[]>([]);

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins;
    return coins.filter(
      (coin) =>
        coin.coinid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coin.tokenamount &&
          coin.tokenamount.toString().includes(searchQuery)) ||
        (coin.amount && coin.amount.toString().includes(searchQuery))
    );
  }, [coins, searchQuery]);

  const [displayedCoins, setDisplayedCoins] = useState<Coin[]>(
    filteredCoins.slice(0, 20)
  );

  // Reset displayed coins when search query changes
  useEffect(() => {
    setDisplayedCoins(filteredCoins.slice(0, 20));
    setStatusMessage(null);
    setHasReachedEnd(false);
    setPendingCoins([]);
  }, [searchQuery, filteredCoins]);

  const loadMore = () => {
    if (isLoadingMore || hasReachedEnd) return;

    setIsLoadingMore(true);
    setStatusMessage("loading");

    const currentLength = displayedCoins.length;
    const nextBatch = filteredCoins.slice(currentLength, currentLength + 20);
    setPendingCoins(nextBatch);

    setTimeout(() => {
      if (currentLength + nextBatch.length >= filteredCoins.length) {
        setHasReachedEnd(true);
        setTimeout(() => {
          setDisplayedCoins((prev) => [...prev, ...nextBatch]);
          setStatusMessage("all");
          setTimeout(() => {
            setStatusMessage(null);
          }, 3000);
        }, 1000);
      } else {
        setTimeout(() => {
          setDisplayedCoins((prev) => [...prev, ...nextBatch]);
          setStatusMessage(null);
        }, 1000);
      }
      setIsLoadingMore(false);
    }, 500);
  };

  // Reset messages when dialog closes
  useEffect(() => {
    if (!open) {
      setStatusMessage(null);
      setHasReachedEnd(false);
      setDisplayedCoins(filteredCoins.slice(0, 20));
      setPendingCoins([]);
    }
  }, [open, filteredCoins]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg">
        <CommandInput
          placeholder="Search coins..."
          value={searchQuery}
          onValueChange={onSearch}
        />
        <CommandList className="max-h-[500px]">
          <CommandEmpty>No coins found.</CommandEmpty>
          <CommandGroup
            heading={`Available Coins (${filteredCoins.length} total)`}
          >
            <div style={{ height: "400px" }} className="relative">
              <Virtuoso
                data={displayedCoins}
                endReached={loadMore}
                overscan={20}
                itemContent={(_, coin) => (
                  <CommandItem
                    key={coin.coinid}
                    value={coin.coinid}
                    onSelect={() => setSelectedCoin(coin)}
                    className="relative overflow-hidden cursor-pointer px-2 h-[60px]"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {selectedCoin?.coinid === coin.coinid ? (
                        <motion.div
                          key="untrack-view"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center justify-between w-full h-full"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedCoin(null);
                            }}
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            Back
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onUntrack?.(coin.coinid);
                              setSelectedCoin(null);
                            }}
                          >
                            <MinusCircle className="h-3 w-3 mr-1" />
                            Untrack
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="coin-info"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex flex-col justify-center h-full"
                        >
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {coin.coinid}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatTokenAmount(coin.amount)}{" "}
                            {coin.tokenid === "0x00" ? "MINIMA" : "Tokens"}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <CommandSeparator className="absolute bottom-0 left-0 right-0" />
                  </CommandItem>
                )}
              />
            </div>
            <AnimatePresence mode="wait">
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="sticky bottom-0 left-0 right-0 p-2 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t"
                >
                  {statusMessage === "loading"
                    ? "Loading..."
                    : "Showing all coins"}
                </motion.div>
              )}
            </AnimatePresence>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
