import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Hint } from "../hint";
import { InfoIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Coin } from "@minima-global/mds";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import { CopyButton } from "../copy-button";

export function CoinInfoDialog({ coin }: { coin: Coin }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="pb-2 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded text-muted-foreground shrink-0">
                Coin ID
              </span>
              <span className="font-mono text-xs truncate flex-1">
                {coin.coinid}
              </span>
              <CopyButton
                onCopy={async () => {
                  await navigator.clipboard.writeText(coin.coinid);
                }}
                label="Copy Coin ID"
                className="h-6 px-2 mr-2"
              />
            </div>
            {coin.address && (
              <div className="flex items-center gap-2">
                <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded text-muted-foreground shrink-0">
                  Address
                </span>
                <span className="font-mono text-xs truncate flex-1">
                  {coin.miniaddress}
                </span>
                <CopyButton
                  onCopy={async () => {
                    await navigator.clipboard.writeText(coin.miniaddress);
                  }}
                  label="Copy Address"
                  className="h-6 px-2 mr-2"
                />
              </div>
            )}
            {coin.tokenid && (
              <div className="flex items-center gap-2">
                <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded text-muted-foreground shrink-0">
                  Token ID
                </span>
                <span className="font-mono text-xs truncate flex-1">
                  {coin.tokenid}
                </span>
                <CopyButton
                  onCopy={async () => {
                    await navigator.clipboard.writeText(coin.tokenid);
                  }}
                  label="Copy Token ID"
                  className="h-6 px-2 mr-2"
                />
              </div>
            )}
            {coin.amount && (
              <div className="flex items-center gap-2">
                <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded text-muted-foreground shrink-0">
                  Amount
                </span>
                <span className="font-mono text-xs">{coin.amount}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded text-muted-foreground shrink-0">
                Created
              </span>
              <span className="text-xs">Block {coin.created}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button>
            <Hint label="Click to view coin info">
              <InfoIcon className="w-4 h-4 cursor-pointer" />
            </Hint>
          </button>
        </DialogTrigger>
        <DialogContent className="dark:bg-darkContrast bg-grey10 max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Coin Info</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button>
          <Hint label="Click to view coin info" disableDrawer>
            <InfoIcon className="w-4 h-4 cursor-pointer" />
          </Hint>
        </button>
      </DrawerTrigger>
      <DrawerContent className="dark:bg-darkContrast bg-grey10">
        <DrawerHeader>
          <DrawerTitle>Coin Info</DrawerTitle>
          <DrawerDescription>
            View detailed information about this coin
          </DrawerDescription>
        </DrawerHeader>
        {content}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
