import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SplitForm,
  splitFormSchema,
  SplitFormValues,
} from "@/components/tokens/split-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { splitCoins } from "@/lib/minima/mds-functions"

export function SplitDialog() {
  const queryClient = useQueryClient()
  const [splitType, setSplitType] = useState<"total" | "perCoin">("total")
  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: (values: SplitFormValues) => splitCoins(values),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await queryClient.invalidateQueries({
        queryKey: ["coinsByTokenId", tokenId],
      })
      await queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      await queryClient.invalidateQueries({
        queryKey: ["balanceByTokenId", tokenId],
      })
    },
    onError: (error) => {
      console.error("Split failed:", error)
    },
  })

  const form = useForm<SplitFormValues>({
    resolver: zodResolver(splitFormSchema),
    defaultValues: {
      totalAmount: 0,
      numberOfCoins: 2,
      amountPerCoin: 0,
      tokenId,
      splitType: "total",
    },
  })

  const handleSplit = async (values: SplitFormValues) => {
    mutate(values)
  }

  const handleSplitTypeChange = (newType: "total" | "perCoin") => {
    setSplitType(newType)
    form.setValue("splitType", newType)
    if (newType === "total") {
      form.setValue("amountPerCoin", 0)
    } else {
      form.setValue("totalAmount", 0)
    }
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

        {isSuccess && (
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
              <div className="text-xl font-medium text-green-400 text-center w-full">
                Coins split successfully!
              </div>
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
