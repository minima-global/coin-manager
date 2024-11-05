import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"

// Base schema with common fields
const baseSchema = {
  tokenId: z.string(),
  numberOfCoins: z.coerce.number().min(2, "Must split into at least 2 coins"),
}

// Schema for total amount splitting
const totalSplitSchema = z.object({
  ...baseSchema,
  totalAmount: z.coerce.number().min(1, "Amount must be greater than 0"),
  amountPerCoin: z.coerce.number().optional(), // Make optional for this mode
})

// Schema for per-coin amount splitting
const perCoinSplitSchema = z.object({
  ...baseSchema,
  amountPerCoin: z.coerce
    .number()
    .min(1, "Amount per coin must be greater than 0"),
  totalAmount: z.coerce.number().optional(), // Make optional for this mode
})

// Combined schema using discriminated union
export const splitFormSchema = z.discriminatedUnion("splitType", [
  totalSplitSchema.extend({ splitType: z.literal("total") }),
  perCoinSplitSchema.extend({ splitType: z.literal("perCoin") }),
])

export type SplitFormValues = z.infer<typeof splitFormSchema>

interface SplitFormProps {
  onSubmit: (values: SplitFormValues) => void
  form: UseFormReturn<SplitFormValues>
  splitType: "total" | "perCoin"
}

export function SplitForm({ onSubmit, form, splitType }: SplitFormProps) {
  return (
    <Form {...form}>
      <form
        id="split-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {splitType === "total" ? (
          <>
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount to Split</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfCoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Coins</FormLabel>
                  <FormControl>
                    <Input type="number" min={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="numberOfCoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Coins</FormLabel>
                  <FormControl>
                    <Input type="number" min={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountPerCoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount per Coin</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  )
}
