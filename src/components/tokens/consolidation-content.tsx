import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConsolidateForm } from "@/components/tokens/consolidate-form"
import { useMutation } from "@tanstack/react-query"
import {
  consolidateCoins,
  manualConsolidation,
} from "@/lib/minima/mds-functions"
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
import { ConsolidationDialog } from "@/components/dialogs/consolidation-dialog"
import { CopyButton } from "../copy-button"
import type { MDSResObj, Transaction } from "@minima-global/mds"

export function ConsolidationContent() {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [cliCommand, setCliCommand] = useState("")
  const [consolidationData, setConsolidationData] = useState<
    MDSResObj<Transaction> | string | undefined
  >()

  const tokenId = useParams({ from: "/tokens/$tokenId" }).tokenId

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
    return `consolidate maxcoins:${values.maxInputs} coinage:${values.minConfirmations} maxsigs:${values.maxSignatures} burn:${values.burn} tokenid:${values.tokenId}`
  }

  // Subscribe to form changes
  form.watch((values) => {
    setCliCommand(generateCliCommand(values as ConsolidationFormValues))
  })

  // Initialize CLI command with default values
  useEffect(() => {
    setCliCommand(generateCliCommand(form.getValues()))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
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

          <div className="flex gap-2">
            <div className="p-3 dark:bg-darkContrast bg-grey10 flex-1 overflow-x-auto rounded">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm text-muted-foreground whitespace-nowrap">
                  {cliCommand}
                </code>
              </div>
            </div>

            <CopyButton />
          </div>

          <ConsolidationDialog
            disabled={isPending}
            error={error}
            isPending={isPending}
            consolidationData={consolidationData}
            isSuccess={isSuccess}
          />
        </motion.div>
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
    string | undefined | MDSResObj<Transaction>
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
      <div className="flex flex-col gap-2 dark:bg-darkContrast bg-grey20 p-3 ">
        <p className="text-sm text-muted-foreground">
          Selected Coins: {coinIds.length}
        </p>
        <p className="text-sm truncate text-muted-foreground max-w-sm">
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
            <div className="gif gif-dark my-4 invert dark:invert-0" />
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
                      {mdsEventData.result.message ? (
                        <p className="text-sm text-muted-foreground mt-2 text-red-400">
                          {mdsEventData.result.message}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2 text-red-400">
                          Consolidation Failed!
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {typeof consolidationData === "string" &&
                    mdsEventData?.uid !== consolidationData && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <div className="gif gif-dark my-4 invert dark:invert-0" />
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
            <Button
              type="submit"
              className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
            >
              Confirm Consolidation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
