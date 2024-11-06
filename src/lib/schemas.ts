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

// Update the custom split schema
const customSplitSchema = z.object({
  ...baseSchema,
  totalAmount: z.coerce.number().optional(),
  amountPerCoin: z.coerce.number().optional(),
  splitAmount: z.coerce
    .number()
    .min(0.000001, "Split amount must be greater than 0"),
  splits: z
    .array(
      z.object({
        address: z.string().min(1, "Address is required"),
        amount: z.coerce
          .number()
          .min(0.000001, "Amount must be greater than 0"),
      })
    )
    .min(1, "At least one split is required"),
})

// Combined schema using discriminated union
export const splitFormSchema = z.discriminatedUnion("splitType", [
  totalSplitSchema.extend({ splitType: z.literal("total") }),
  perCoinSplitSchema.extend({ splitType: z.literal("perCoin") }),
  customSplitSchema.extend({ splitType: z.literal("custom") }),
])

export type SplitFormValues = z.infer<typeof splitFormSchema>
