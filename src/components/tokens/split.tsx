import { useState } from "react"
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

import { Nav } from "@/components/nav"
import { SplitDialog } from "../dialogs/split-dialog"

type SplitType = "total" | "perCoin" | "custom"

export function Split() {
  const [splitData, setSplitData] = useState<string | undefined>(undefined)
  const [splitType, setSplitType] = useState<SplitType>("total")
  const [hoveredLink, setHoveredLink] = useState<SplitType | null>(null)

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

  const { mutate, isPending, isSuccess, error } = useMutation({
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

  const handleSplitTypeChange = (
    newType: "auto" | "manual" | "total" | "perCoin" | "custom"
  ) => {
    if (newType === "total" || newType === "perCoin" || newType === "custom") {
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
  }

  const handleHoveredLinkChange = (
    link: "auto" | "manual" | "total" | "perCoin" | "custom" | null
  ) => {
    if (
      link === null ||
      link === "total" ||
      link === "perCoin" ||
      link === "custom"
    ) {
      setHoveredLink(link)
    }
  }

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
          <Nav
            activeTab={splitType}
            setActiveTab={handleSplitTypeChange}
            hoveredLink={hoveredLink}
            setHoveredLink={handleHoveredLinkChange}
            mode="split"
          />

          <motion.div
            layout
            key={splitType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <SplitForm
              form={form}
              onSubmit={handleSplit}
              splitType={splitType}
            />
          </motion.div>

          <motion.div layout>
            <SplitDialog
              disabled={isPending}
              error={error}
              isPending={isPending}
              splitData={splitData}
              isSuccess={isSuccess}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
