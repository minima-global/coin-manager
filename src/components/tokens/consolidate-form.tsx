import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { ConsolidationFormValues } from "@/lib/schemas";
import { Info } from "lucide-react";
import { Hint } from "../hint";

interface ConsolidateFormProps {
  onSubmit: (values: ConsolidationFormValues) => void;
  showAdvancedOptions: boolean;
  form: UseFormReturn<ConsolidationFormValues>;
  disabled: boolean;
}

export function ConsolidateForm({
  onSubmit,
  showAdvancedOptions,
  form,
  disabled,
}: ConsolidateFormProps) {
  return (
    <Form {...form}>
      <form
        id="consolidate-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="maxInputs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Coins</FormLabel>
              <FormDescription>
                The maximum number of coins to consolidate. The lowest value
                coins will be prioritized. The consolidation will create two
                equal value coins.
              </FormDescription>
              <FormControl>
                <div className=" relative flex items-center">
                  <Input
                    disabled={disabled}
                    type="number"
                    inputMode="numeric"
                    className="dark:bg-darkContrast bg-grey10"
                    min={1}
                    max={20}
                    {...field}
                  />
                  <div className=" absolute right-2">
                    <Hint
                      side="left"
                      align="center"
                      label="The maximum number of coins to consolidate. The lowest value coins will be prioritized. The consolidation will create two equal value coins."
                    >
                      <Info className=" h-4 w-4" />
                    </Hint>
                  </div>
                </div>
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
              className="space-y-2 bg-grey10 dark:bg-darkContrast p-4"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="minConfirmations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coin Age</FormLabel>
                      <FormControl>
                        <div className=" relative flex items-center">
                          <Input
                            disabled={disabled}
                            type="number"
                            inputMode="numeric"
                            className="dark:bg-lightDarkContrast bg-grey20"
                            {...field}
                          />
                          <div className=" absolute right-2">
                            <Hint
                              side="left"
                              align="center"
                              label="Only consolidate coins older than this many blocks."
                            >
                              <Info className=" h-4 w-4" />
                            </Hint>
                          </div>
                        </div>
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
                      <FormControl>
                        <div className=" relative flex items-center">
                          <Input
                            disabled={disabled}
                            type="number"
                            inputMode="numeric"
                            className="dark:bg-lightDarkContrast bg-grey20"
                            {...field}
                          />
                          <div className=" absolute right-2">
                            <Hint
                              side="left"
                              align="center"
                              label="The maximum number of signatures to be used in the transaction. This impacts the size of the transaction."
                            >
                              <Info className=" h-4 w-4" />
                            </Hint>
                          </div>
                        </div>
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
                      <FormControl>
                        <div className=" relative flex items-center">
                          <Input
                            disabled={disabled}
                            type="number"
                            inputMode="numeric"
                            className="dark:bg-lightDarkContrast bg-grey20"
                            {...field}
                          />
                          <div className=" absolute right-2">
                            <Hint
                              side="left"
                              align="center"
                              label="Enter a value of Minima to burn with the transaction"
                            >
                              <Info className=" h-4 w-4" />
                            </Hint>
                          </div>
                        </div>
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
  );
}
