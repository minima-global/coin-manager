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
export function CoinInfoDialog({ coin }: { coin: Coin }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
        <DialogContent className="dark:bg-darkContrast bg-grey10">
          <DialogHeader>
            <DialogTitle>Coin Info</DialogTitle>
          </DialogHeader>

          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className=" pb-4 pt-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0 w-20">
                      Coin ID:
                    </span>
                    <span className="font-mono truncate min-w-0">
                      {coin.coinid}
                    </span>
                  </div>
                  {coin.address && (
                    <div className="flex items-center">
                      <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0 w-20">
                        Address:
                      </span>
                      <span className="font-mono truncate min-w-0">
                        {coin.miniaddress}
                      </span>
                    </div>
                  )}
                  {coin.tokenid && (
                    <div className="flex items-center">
                      <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0 w-20">
                        Token ID:
                      </span>
                      <span className="font-mono truncate min-w-0">
                        {coin.tokenid}
                      </span>
                    </div>
                  )}
                  {coin.tokenamount && (
                    <div className="flex items-center">
                      <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0 w-20">
                        Amount:
                      </span>
                      <span className="font-mono truncate min-w-0">
                        {coin.tokenamount}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0 w-20">
                      Created:
                    </span>
                    <span>Block {coin.created}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button>
          <Hint label="Click to view coin info">
            <InfoIcon className="w-4 h-4 cursor-pointer" />
          </Hint>
        </button>
      </DrawerTrigger>
      <DrawerContent className="dark:bg-darkContrast bg-grey10">
        <DrawerHeader>
          <DrawerTitle>Consolidate</DrawerTitle>
          <DrawerDescription>
            Consolidate your coins automatically
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className=" pb-4 pt-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0">
                      Coin ID:
                    </span>
                    <span className="font-mono truncate min-w-0">
                      {coin.coinid}
                    </span>
                  </div>
                  {coin.address && (
                    <div className="flex items-center">
                      <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0">
                        Address:
                      </span>
                      <span className="font-mono truncate min-w-0">
                        {coin.miniaddress}
                      </span>
                    </div>
                  )}
                  {coin.tokenid && (
                    <div className="flex items-center">
                      <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0">
                        Token ID:
                      </span>
                      <span className="font-mono truncate min-w-0">
                        {coin.tokenid}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="font-medium bg-grey40 dark:bg-lightDarkContrast text-primary py-[2px] px-2 mr-1 shrink-0">
                      Created:
                    </span>
                    <span>Block {coin.created}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

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
