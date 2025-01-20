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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg">
        <CommandInput
          placeholder="Search coins..."
          value={searchQuery}
          onValueChange={onSearch}
        />
        <CommandList>
          <CommandEmpty>No coins found.</CommandEmpty>
          <CommandGroup heading="Available Coins">
            {coins.map((coin) => (
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
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
