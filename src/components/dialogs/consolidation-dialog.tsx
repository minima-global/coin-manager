import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  CheckCircle,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  Loader2,
  XCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConsolidateForm } from "@/components/tokens/consolidate-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  consolidateCoins,
  isTxnPending,
  manualConsolidation,
} from "@/lib/minima/mds-functions"
import { SendResponse } from "@minima-global/mds"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import { MDSError } from "@/lib/error"

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
  const [cliCommand, setCliCommand] = useState("")
  const [consolidationData, setConsolidationData] = useState<
    SendResponse | string | undefined
  >()
  const [isCopied, setIsCopied] = useState(false)

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
    error,
  } = useMutation({
    mutationFn: (values: ConsolidationFormValues) => consolidateCoins(values),
    onSuccess: async (responseData) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      setConsolidationData(responseData.data)
      queryClient.invalidateQueries({ queryKey: ["coinsByTokenId", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["balanceByTokenId", tokenId] })
    },
    onError: (error) => {
      if (error instanceof MDSError && error.error_tag === "txpow_to_big") {
        toast.error(
          "The transaction is too big to be consolidated. Please try again with fewer coins."
        )
      }
    },
  })

  const { data: isTxnPendingData } = useQuery({
    queryKey: ["isPending", tokenId],
    queryFn: () => isTxnPending(consolidationData as string),
    enabled: !!consolidationData,
    refetchInterval: (data) => {
      queryClient.invalidateQueries({ queryKey: ["coinsByTokenId", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["balanceByTokenId", tokenId] })
      if (data) {
        return 1000
      }
      queryClient.invalidateQueries({ queryKey: ["coinsByTokenId", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["balanceByTokenId", tokenId] })
      return false
    },
  })

  const handleConsolidate = (values: ConsolidationFormValues) => {
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

  const generateCliCommand = (values: ConsolidationFormValues) => {
    return `consolidate maxcoins:${values.maxInputs} coinage:${values.minConfirmations} maxsigs:${values.maxSignatures} burn:${values.burn}`
  }

  // Subscribe to form changes
  form.watch((values) => {
    setCliCommand(generateCliCommand(values as ConsolidationFormValues))
  })

  // Initialize CLI command with default values
  useEffect(() => {
    setCliCommand(generateCliCommand(form.getValues()))
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
    toast.success("Copied to clipboard")
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
            Consolidate your coins automatically
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!isPending && !isSuccess && !error && (
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

                <div className="p-3 bg-muted">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-muted-foreground">
                      {cliCommand}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(cliCommand)}
                          >
                            <motion.div
                              animate={{
                                scale: isCopied ? [1, 1.2, 0.9, 1] : 1,
                                rotate: isCopied ? [0, 15, -5, 0] : 0,
                              }}
                              transition={{
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <motion.div
                                initial={false}
                                animate={{
                                  opacity: isCopied ? 0 : 1,
                                  y: isCopied ? -20 : 0,
                                  position: "absolute",
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <CopyIcon className="w-4 h-4" />
                              </motion.div>
                              <motion.div
                                initial={false}
                                animate={{
                                  opacity: isCopied ? 1 : 0,
                                  y: isCopied ? 0 : 20,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <CheckIcon className="w-4 h-4 text-emerald-500" />
                              </motion.div>
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
                    <XCircle className="w-8 h-8 text-red-400" />
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
                className="flex flex-col items-center justify-center pt-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="flex flex-col items-center justify-center gap-2 mt-2"
                >
                  {!isTxnPendingData ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Consolidation Successful!
                      </p>
                    </div>
                  ) : (
                    <>
                      {typeof consolidationData === "string" ? (
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <p className="text-sm text-muted-foreground mt-2">
                            You must accept the consolidation in the pending
                            app...
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                            {consolidationData}
                          </p>
                        </div>
                      ) : null}
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const manualConsolidationFormSchema = z.object({
  coinIds: z.array(z.string()),
  tokenId: z.string(),
})

type ManualConsolidationFormValues = z.infer<
  typeof manualConsolidationFormSchema
>

interface ManualConsolidationDialogProps {
  coinIds: string[]
  onConsolidate?: () => void
}

export function ManualConsolidationDialog({
  coinIds,
  onConsolidate,
}: ManualConsolidationDialogProps) {
  const queryClient = useQueryClient()
  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId
  const [open, setOpen] = useState(false)
  const [consolidationData, setConsolidationData] = useState<
    string | undefined | SendResponse
  >()

  const form = useForm<ManualConsolidationFormValues>({
    resolver: zodResolver(manualConsolidationFormSchema),
    defaultValues: {
      coinIds,
      tokenId,
    },
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (values: ManualConsolidationFormValues) =>
      manualConsolidation(values.coinIds),
    onSuccess: async (responseData) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      setConsolidationData(responseData.data)
      queryClient.invalidateQueries({ queryKey: ["coinsByTokenId", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["token", tokenId] })
      queryClient.invalidateQueries({ queryKey: ["balanceByTokenId", tokenId] })
    },
  })

  const { data: isTxnPendingData } = useQuery({
    queryKey: ["isPending", tokenId],
    queryFn: () => isTxnPending(consolidationData as string),
    enabled: !!consolidationData,
    refetchInterval: (data) => (data ? 1000 : false),
  })

  const handleSubmit = (values: ManualConsolidationFormValues) => {
    mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen && !isPending) {
          onConsolidate?.()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.reset({ coinIds, tokenId })
            setOpen(true)
          }}
        >
          Consolidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manual Consolidate</DialogTitle>
          <DialogDescription>
            Consolidate {coinIds.length} selected coins
          </DialogDescription>
        </DialogHeader>

        <form
          id="manual-consolidate-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Selected Coins: {coinIds.length}
            </p>
            <p className="text-sm truncate text-muted-foreground max-w-md">
              Token ID: {tokenId}
            </p>
          </div>

          <AnimatePresence mode="wait">
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
                  Consolidating your coins...
                </p>
              </motion.div>
            )}

            {isSuccess && consolidationData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center pt-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="flex flex-col items-center justify-center gap-2 mt-2"
                >
                  {!isTxnPendingData ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Consolidation Successful!
                      </p>
                    </div>
                  ) : (
                    <>
                      {typeof consolidationData === "string" ? (
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <p className="text-sm text-muted-foreground mt-2">
                            You must accept the consolidation in the pending
                            app...
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                            {consolidationData}
                          </p>
                        </div>
                      ) : null}
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            {!isPending && !isSuccess && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-4"
              >
                <Button type="submit" className="w-full">
                  Confirm Consolidation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {isSuccess && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setOpen(false)
                onConsolidate?.()
              }}
            >
              Close
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
