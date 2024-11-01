import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ChevronDownIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConsolidateForm } from "@/components/tokens/consolidate-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { checkConsolidation } from "@/lib/minima/mds-functions"
import { SendResponse } from "@minima-global/mds"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useParams } from "@tanstack/react-router"

const consolidationFormSchema = z.object({
  minConfirmations: z.coerce
    .number()
    .min(0, "Minimum confirmations must be at least 0"),
  maxSignatures: z.coerce
    .number()
    .min(1, "Must have at least 1 signature")
    .max(5, "Cannot exceed 5 signatures"),
  maxInputs: z.coerce
    .number()
    .min(3, "Must have at least 3 coins")
    .max(20, "Cannot exceed 20 inputs"),
  burn: z.coerce.number().min(0, "Burn amount must be at least 0"),
  tokenId: z.string(),
})

export type ConsolidationFormValues = z.infer<typeof consolidationFormSchema>

interface ConsolidationDialogProps {
  disabled?: boolean
}

export function ConsolidationDialog({ disabled }: ConsolidationDialogProps) {
  const queryClient = useQueryClient()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [consolidationData, setConsolidationData] = useState<
    SendResponse | undefined
  >()
  const [error, setError] = useState<string | undefined>(undefined)

  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId

  const form = useForm<ConsolidationFormValues>({
    resolver: zodResolver(consolidationFormSchema),
    defaultValues: {
      minConfirmations: 3,
      maxSignatures: 5,
      maxInputs: 3,
      burn: 0,
      tokenId,
    },
  })

  const {
    mutate,
    isPending,
    isSuccess,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (values: ConsolidationFormValues) => checkConsolidation(values),
    onSuccess: async (responseData) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))

      setConsolidationData(responseData.data)
      queryClient.invalidateQueries({ queryKey: ["coinsByTokenId", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["balanceByTokenId", tokenId] })
      if (responseData.error) {
        setError(responseData.error)
      }
    },
  })

  const handleConsolidate = (values: ConsolidationFormValues) => {
    console.log("Consolidation values:", values)
    mutate(values)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setIsOptionsOpen(false)
      setConsolidationData(undefined)
      resetMutation()
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant="outline">Consolidate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Consolidate</DialogTitle>
          <DialogDescription>
            {isSuccess && !consolidationData?.error
              ? "Coins consolidated successfully!"
              : "Consolidate your coins automatically"}
          </DialogDescription>
        </DialogHeader>

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
                <ConsolidateForm
                  form={form}
                  onSubmit={handleConsolidate}
                  showAdvancedOptions={isOptionsOpen}
                />

                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size={"sm"}
                    className="p-0 w-fit hover:bg-transparent text-muted-foreground text-sm"
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  >
                    Advanced Options{" "}
                    <motion.div
                      animate={{ rotate: isOptionsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </div>

                <Button
                  type="submit"
                  form="consolidate-form"
                  className="w-full"
                >
                  Consolidate
                </Button>
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
                  Checking input size...
                </p>
              </motion.div>
            )}

            {isSuccess && error && (
              <motion.div
                key="success"
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
                  <div className="text-xl font-medium text-red-400">
                    Something went wrong
                  </div>
                </motion.div>
              </motion.div>
            )}

            {isSuccess && !error && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-start justify-start py-8 pt-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="flex flex-col items-start justify-start gap-2 mt-2"
                >
                  <p className="text-sm truncate text-muted-foreground max-w-md ">
                    <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                      TxPow ID:{" "}
                    </span>
                    {consolidationData?.response.txpowid}
                  </p>
                  <p className="text-sm truncate text-muted-foreground max-w-md ">
                    <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                      Size:
                    </span>
                    {consolidationData?.response.size} bytes
                  </p>

                  <h3 className="text-sm font-medium my-2">Coins</h3>

                  <div className="flex flex-col gap-2">
                    {consolidationData?.response.body.txn.outputs.map(
                      (coin) => (
                        <div key={coin.coinid} className="flex flex-col gap-1">
                          <p className="text-sm truncate text-muted-foreground max-w-md ">
                            <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                              Coin ID:
                            </span>
                            {coin.coinid}
                          </p>
                          <p className="text-sm truncate text-muted-foreground max-w-md ">
                            <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                              Amount:
                            </span>
                            {
                              /** @ts-ignore */
                              // TODO: fix this in mds package
                              coin.tokenamount
                            }
                          </p>
                          <p className="text-sm truncate text-muted-foreground max-w-md ">
                            <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                              Created:
                            </span>
                            {coin.created}
                          </p>
                          <div className="h-[1px] w-full bg-muted-foreground/20 my-2" />
                        </div>
                      )
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size={"sm"}
                    className="w-full"
                    onClick={() => {
                      form.reset()
                      setOpen(false)
                    }}
                  >
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
