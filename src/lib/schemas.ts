import { z } from "zod";

// Base schema with common fields
const baseSchema = {
  tokenId: z.string(),
  numberOfCoins: z.coerce
    .number()
    .min(1, "Must split into at least 2 coins")
    .max(10, "Max 10 coins"),
};

// Schema for total amount splitting
const totalSplitSchema = z.object({
  ...baseSchema,
  totalAmount: z.coerce.number().min(1, "Amount must be greater than 0"),
  amountPerCoin: z.coerce.number().optional(), // Make optional for this mode
});

// Schema for per-coin amount splitting
const perCoinSplitSchema = z.object({
  ...baseSchema,
  amountPerCoin: z.coerce
    .number()
    .min(1, "Amount per coin must be greater than 0"),
  totalAmount: z.coerce.number().optional(), // Make optional for this mode
});

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
});

// Combined schema using discriminated union
export const splitFormSchema = z.discriminatedUnion("splitType", [
  totalSplitSchema.extend({ splitType: z.literal("total") }),
  perCoinSplitSchema.extend({ splitType: z.literal("perCoin") }),
  customSplitSchema.extend({ splitType: z.literal("custom") }),
]);

export const consolidationFormSchema = z.object({
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
});

export const manualConsolidationFormSchema = z.object({
  coinIds: z.array(z.string()),
  tokenId: z.string(),
});

export const trackCoinFormSchema = z.object({
  coinId: z.string(),
});

export type TrackCoinFormValues = z.infer<typeof trackCoinFormSchema>;
export type ManualConsolidationFormValues = z.infer<
  typeof manualConsolidationFormSchema
>;
export type ConsolidationFormValues = z.infer<typeof consolidationFormSchema>;
export type SplitFormValues = z.infer<typeof splitFormSchema>;
