import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AnimatePresence, motion } from "framer-motion"
import { ConsolidationFormValues } from "@/lib/schemas"

interface ConsolidateFormProps {
  onSubmit: (values: ConsolidationFormValues) => void
  showAdvancedOptions: boolean
  form: UseFormReturn<ConsolidationFormValues>
}

export function ConsolidateForm({
  onSubmit,
  showAdvancedOptions,
  form,
}: ConsolidateFormProps) {
  return (
    <Form {...form}>
      <form
        id="consolidate-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="maxInputs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Coins</FormLabel>
              <FormDescription>
                Enter the maximum number of coins to consolidate
              </FormDescription>
              <FormControl>
                <Input type="number" min={1} max={20} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="minConfirmations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coin Age</FormLabel>
                      <FormDescription>
                        Enter the minimum block confirmations required for the
                        coins being consolidated
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSignatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Signatures</FormLabel>
                      <FormDescription>
                        If your coins are split across multiple wallet
                        addresses, enter the maximum number of addresses to be
                        used in the consolidation.
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="burn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burn</FormLabel>
                      <FormDescription>
                        Enter a value of Minima to burn with the transaction
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  )
}
