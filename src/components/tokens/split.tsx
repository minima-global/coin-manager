import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SplitForm } from "@/components/tokens/split-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { splitCoins } from "@/lib/minima/mds-functions"
import { splitFormSchema, SplitFormValues } from "@/lib/schemas"
import { toast } from "sonner"
import { MDSError } from "@/lib/error"
import { appContext } from "@/AppContext"

export function Split() {
  const [splitData, setSplitData] = useState<string | undefined>(undefined)
  const [splitType, setSplitType] = useState<"total" | "perCoin" | "custom">(
    "total"
  )

  const { mdsEventData } = useContext(appContext)
  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId

  const form = useForm<SplitFormValues>({
    resolver: zodResolver(splitFormSchema),
    defaultValues: {
      totalAmount: 0,
      amountPerCoin: 0,
      numberOfCoins: 2,

      tokenId,
      splitType: "total" as const,
    },
  })

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: (values: SplitFormValues) => splitCoins(values),
    onSuccess: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSplitData(data.data)
    },
    onError: (error) => {
      if (error instanceof MDSError && error.error_tag === "txpow_to_big") {
        toast.error(
          "The transaction is too big to be consolidated. Please try again with fewer coins."
        )
      } else if (
        error instanceof MDSError &&
        error.error_tag === "too_many_outputs"
      ) {
        toast.error(
          "The number of addresses and split amount is too high. Please try again with fewer addresses or a lower split amount."
        )
      }
    },
  })

  const handleSplit = async (values: SplitFormValues) => {
    mutate(values)
  }

  const handleSplitTypeChange = (newType: "total" | "perCoin" | "custom") => {
    setSplitType(newType)
    form.setValue("splitType", newType as any)
    form.reset({
      totalAmount: 0,
      amountPerCoin: 0,
      numberOfCoins: 2,
      splitAmount: 0,
      tokenId,
      splitType: newType as any,
      splits: newType === "custom" ? [{ address: "", amount: 0 }] : [],
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {!isPending && !isSuccess && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            <motion.div layout className="flex gap-2">
              <Button
                type="button"
                variant={splitType === "total" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("total")}
                className="flex-1"
              >
                Split Total Amount
              </Button>
              <Button
                type="button"
                variant={splitType === "perCoin" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("perCoin")}
                className="flex-1"
              >
                Split by Amount per Coin
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("custom")}
                className="flex-1"
              >
                Custom Split
              </Button>
            </motion.div>

            <motion.div
              layout
              key={splitType}
              initial={{ opacity: 0, x: splitType === "total" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: splitType === "total" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <SplitForm
                form={form}
                onSubmit={handleSplit}
                splitType={splitType}
              />
            </motion.div>

            <motion.div layout>
              <Button type="submit" form="split-form" className="w-full">
                Split
              </Button>
            </motion.div>
          </motion.div>
        )}

        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-muted-foreground mt-2">
              Splitting coins...
            </p>
          </motion.div>
        )}

        {isSuccess && splitData && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-start justify-start py-8 pt-2 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="flex flex-col items-center justify-canter gap-2 mt-2 w-full"
            >
              {mdsEventData?.uid === splitData ? (
                <>
                  {mdsEventData.accept ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Split Successful!
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Your coins will be available to use shortly
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-red-400">
                        Split Failed!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {typeof splitData === "string" &&
                    mdsEventData?.uid !== splitData && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm text-muted-foreground mt-2">
                          You must accept the split in the pending app...
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                          {splitData}
                        </p>
                      </div>
                    )}
                </>
              )}

              <Button
                type="button"
                variant="outline"
                size={"sm"}
                className="w-full mt-4"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
