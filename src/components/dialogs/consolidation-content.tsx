import { Button } from "@/components/ui/button"
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
import { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConsolidateForm } from "@/components/tokens/consolidate-form"
import { useMutation } from "@tanstack/react-query"
import {
  consolidateCoins,
  manualConsolidation,
} from "@/lib/minima/mds-functions"
import { SendResponse } from "@minima-global/mds"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import { MDSError } from "@/lib/error"
import {
  ConsolidationFormValues,
  manualConsolidationFormSchema,
  ManualConsolidationFormValues,
} from "@/lib/schemas"
import { consolidationFormSchema } from "@/lib/schemas"
import { appContext } from "@/AppContext"

export function ConsolidationContent() {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [cliCommand, setCliCommand] = useState("")
  const [consolidationData, setConsolidationData] = useState<
    SendResponse | string | undefined
  >()
  const [isCopied, setIsCopied] = useState(false)
  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId
  const { mdsEventData } = useContext(appContext)

  // Consolidation form
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

  // Consolidation mutation
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (values: ConsolidationFormValues) => consolidateCoins(values),
    onSuccess: async (responseData) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      setConsolidationData(responseData.data)
    },
    onError: (error) => {
      if (error instanceof MDSError && error.error_tag === "txpow_to_big") {
        toast.error(
          "The transaction is too big to be consolidated. Please try again with fewer coins."
        )
      }
    },
  })

  // Handle the consolidation
  const handleConsolidate = (values: ConsolidationFormValues) => {
    mutate(values)
  }

  // Generate the CLI command for the consolidation
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

            <Button type="submit" form="consolidate-form" className="w-full">
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
              {mdsEventData?.uid === consolidationData ? (
                <>
                  {mdsEventData.accept ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Consolidation Successful!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-red-400">
                        Consolidation Failed!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {typeof consolidationData === "string" &&
                    mdsEventData?.uid !== consolidationData && (
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
                    )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ManualConsolidationContentProps {
  coinIds: string[]
  onConsolidate?: () => void
}

export function ManualConsolidationContent({
  coinIds,
}: ManualConsolidationContentProps) {
  const { mdsEventData } = useContext(appContext)
  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId
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
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setConsolidationData(responseData.data)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const handleSubmit = (values: ManualConsolidationFormValues) => {
    mutate(values)
  }

  return (
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
              {mdsEventData?.uid === consolidationData ? (
                <>
                  {mdsEventData.accept ? (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-emerald-400">
                        Consolidation Successful!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-400" />
                      <p className="text-sm text-muted-foreground mt-2 text-red-400">
                        Consolidation Failed!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {typeof consolidationData === "string" &&
                    mdsEventData?.uid !== consolidationData && (
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
                    )}
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
    </form>
  )
}
