import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { ManualConsolidationContent } from "@/components/tokens/consolidation-content";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { useContext } from "react";
import { appContext } from "@/AppContext";
import type { MDSResponse, Transaction } from "@minima-global/mds";

interface ConsolidationDialogProps {
  disabled?: boolean;
  error: Error | null;
  isPending: boolean;
  consolidationData: MDSResponse<Transaction> | string | undefined;
  isSuccess: boolean;
}

export function ConsolidationDialog({
  disabled,
  error,
  isPending,
  consolidationData,
  isSuccess,
}: ConsolidationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { mdsEventData } = useContext(appContext);

  const consolidationContent = (
    <>
      {isPending && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center justify-center py-8"
        >
          <div className="gif bg-transparent invert dark:invert-0" />

          <p className="text-sm text-muted-foreground mt-2">
            Consolidating your coins...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center justify-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="39"
                fill="none"
                viewBox="0 0 38 39"
              >
                <path
                  fill="#FF627E"
                  d="M18.999 29.265q.595 0 .979-.383.383-.382.383-.977t-.383-.98q-.382-.383-.977-.383t-.979.383-.383.978.383.979q.382.383.977.383m-1.022-7.054h2.269V9.735h-2.269zm1.04 16.593q-3.948 0-7.395-1.496a19.4 19.4 0 0 1-6.038-4.086 19.3 19.3 0 0 1-4.087-6.039Q0 23.733 0 19.783q0-3.934 1.496-7.394t4.085-6.026q2.59-2.565 6.04-4.063Q15.07.804 19.02.804q3.933 0 7.394 1.496 3.46 1.495 6.026 4.06t4.063 6.032Q38 15.859 38 19.787q0 3.948-1.496 7.395t-4.06 6.028-6.032 4.088q-3.466 1.506-7.395 1.506m.008-2.27q6.96 0 11.833-4.888 4.872-4.889 4.872-11.867 0-6.96-4.863-11.833Q26.004 3.074 19 3.073q-6.954 0-11.843 4.864Q2.27 12.8 2.27 19.804q0 6.954 4.887 11.842 4.89 4.888 11.868 4.888"
                ></path>
              </svg>
              <p className="text-sm text-muted-foreground mt-2 text-red-400">
                Something went wrong
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isSuccess && consolidationData && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="flex flex-col items-center justify-center gap-2 "
          >
            {mdsEventData?.uid === consolidationData ? (
              <>
                {mdsEventData.accept && mdsEventData.status ? (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="49"
                      fill="none"
                      viewBox="0 0 48 49"
                    >
                      <mask
                        id="mask0_5417_26503"
                        width="48"
                        height="49"
                        x="0"
                        y="0"
                        maskUnits="userSpaceOnUse"
                        style={{ maskType: "alpha" }}
                      >
                        <path fill="#D9D9D9" d="M0 .804h48v48H0z"></path>
                      </mask>
                      <g mask="url(#mask0_5417_26503)">
                        <path
                          fill="#4FE3C1"
                          d="m21.05 33.23 13.477-13.476-1.742-1.712L21.05 29.796l-5.923-5.923-1.693 1.712zm2.953 10.574q-3.91 0-7.37-1.496a19.3 19.3 0 0 1-6.049-4.086 19.3 19.3 0 0 1-4.087-6.047Q5 28.72 5 24.807q0-3.942 1.496-7.41 1.496-3.47 4.085-6.034 2.59-2.565 6.047-4.063 3.457-1.496 7.369-1.496 3.942 0 7.41 1.496t6.034 4.06 4.063 6.032Q43 20.858 43 24.8q0 3.91-1.496 7.37t-4.06 6.05q-2.564 2.591-6.032 4.087-3.466 1.497-7.408 1.497M24 41.534q6.984 0 11.858-4.888 4.872-4.888 4.873-11.842 0-6.986-4.873-11.858T24 8.073q-6.954 0-11.842 4.873T7.27 24.804q0 6.954 4.888 11.842T24 41.534"
                        ></path>
                      </g>
                    </svg>

                    <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                      Consolidation Successful!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="38"
                      height="39"
                      fill="none"
                      viewBox="0 0 38 39"
                    >
                      <path
                        fill="#FF627E"
                        d="M18.999 29.265q.595 0 .979-.383.383-.382.383-.977t-.383-.98q-.382-.383-.977-.383t-.979.383-.383.978.383.979q.382.383.977.383m-1.022-7.054h2.269V9.735h-2.269zm1.04 16.593q-3.948 0-7.395-1.496a19.4 19.4 0 0 1-6.038-4.086 19.3 19.3 0 0 1-4.087-6.039Q0 23.733 0 19.783q0-3.934 1.496-7.394t4.085-6.026q2.59-2.565 6.04-4.063Q15.07.804 19.02.804q3.933 0 7.394 1.496 3.46 1.495 6.026 4.06t4.063 6.032Q38 15.859 38 19.787q0 3.948-1.496 7.395t-4.06 6.028-6.032 4.088q-3.466 1.506-7.395 1.506m.008-2.27q6.96 0 11.833-4.888 4.872-4.889 4.872-11.867 0-6.96-4.863-11.833Q26.004 3.074 19 3.073q-6.954 0-11.843 4.864Q2.27 12.8 2.27 19.804q0 6.954 4.887 11.842 4.89 4.888 11.868 4.888"
                      ></path>
                    </svg>
                    <p className="text-sm text-muted-foreground mt-2 text-red-400">
                      Consolidation Failed!
                    </p>
                  </div>
                )}
              </>
            ) : typeof consolidationData !== "string" &&
              consolidationData.status ? (
              <div className="flex flex-col gap-2 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="49"
                  fill="none"
                  viewBox="0 0 48 49"
                >
                  <mask
                    id="mask0_5417_26503"
                    width="48"
                    height="49"
                    x="0"
                    y="0"
                    maskUnits="userSpaceOnUse"
                    style={{ maskType: "alpha" }}
                  >
                    <path fill="#D9D9D9" d="M0 .804h48v48H0z"></path>
                  </mask>
                  <g mask="url(#mask0_5417_26503)">
                    <path
                      fill="#4FE3C1"
                      d="m21.05 33.23 13.477-13.476-1.742-1.712L21.05 29.796l-5.923-5.923-1.693 1.712zm2.953 10.574q-3.91 0-7.37-1.496a19.3 19.3 0 0 1-6.049-4.086 19.3 19.3 0 0 1-4.087-6.047Q5 28.72 5 24.807q0-3.942 1.496-7.41 1.496-3.47 4.085-6.034 2.59-2.565 6.047-4.063 3.457-1.496 7.369-1.496 3.942 0 7.41 1.496t6.034 4.06 4.063 6.032Q43 20.858 43 24.8q0 3.91-1.496 7.37t-4.06 6.05q-2.564 2.591-6.032 4.087-3.466 1.497-7.408 1.497M24 41.534q6.984 0 11.858-4.888 4.872-4.888 4.873-11.842 0-6.986-4.873-11.858T24 8.073q-6.954 0-11.842 4.873T7.27 24.804q0 6.954 4.888 11.842T24 41.534"
                    ></path>
                  </g>
                </svg>

                <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                  Consolidation Successful!
                </p>
              </div>
            ) : (
              <>
                {typeof consolidationData === "string" &&
                  mdsEventData?.uid !== consolidationData && (
                    <div className="flex flex-col gap-2 items-center justify-center mb-4">
                      <p className="text-sm text-muted-foreground ">
                        To complete the consolidation, go to the Pending
                        MiniDapp and approve the command. That's it!
                        <br />
                        <br />
                        Once approved, your coins will be consolidated.
                      </p>
                    </div>
                  )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild disabled={disabled}>
          <Button
            type="submit"
            form="consolidate-form"
            className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
          >
            Consolidate
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg dark:bg-darkContrast bg-grey10">
          <DialogHeader>
            <DialogTitle>Consolidate</DialogTitle>
            <DialogDescription>
              Consolidate your coins automatically
            </DialogDescription>
          </DialogHeader>
          {consolidationContent}
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild disabled={disabled}>
        <Button
          type="submit"
          form="consolidate-form"
          className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
        >
          Consolidate
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Consolidate</DrawerTitle>
          <DrawerDescription>
            Consolidate your coins automatically
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          {consolidationContent}
          <DrawerClose asChild>
            <DialogClose asChild>
              <Button className="w-full">Close</Button>
            </DialogClose>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface ManualConsolidationDialogProps {
  coinIds: string[];
  onConsolidate?: () => void;
}

export function ManualConsolidationDialog({
  coinIds,
  onConsolidate,
}: ManualConsolidationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Consolidate {coinIds.length} coins
          </Button>
        </DialogTrigger>
        <DialogContent className=" dark:bg-darkContrast bg-grey10">
          <DialogHeader>
            <DialogTitle>Manual Consolidate</DialogTitle>
            <DialogDescription>
              Consolidate {coinIds.length} selected coins
            </DialogDescription>
          </DialogHeader>

          <ManualConsolidationContent
            coinIds={coinIds}
            onConsolidate={() => {
              onConsolidate?.();
            }}
          />
          <DialogClose asChild>
            <Button
              className="w-full"
              onClick={() => {
                onConsolidate?.();
              }}
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Consolidate</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Manual Consolidate</DrawerTitle>
          <DrawerDescription>
            Consolidate {coinIds.length} selected coins
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <ManualConsolidationContent coinIds={coinIds} />
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onConsolidate?.();
              }}
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
