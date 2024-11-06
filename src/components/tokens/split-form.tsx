import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { getAddress } from "@/lib/minima/mds-functions"
import { SplitFormValues } from "@/lib/schemas"

interface SplitFormProps {
  onSubmit: (values: SplitFormValues) => void
  form: UseFormReturn<SplitFormValues>
  splitType: "total" | "perCoin" | "custom"
}

export function SplitForm({ onSubmit, form, splitType }: SplitFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "splits",
  })

  const handleGenerateAddress = async (index: number) => {
    try {
      const addressResponse = await getAddress()
      if (!addressResponse.error) {
        form.setValue(
          `splits.${index}.address`,
          addressResponse.response.miniaddress
        )
      }
    } catch (error) {
      console.error("Error generating address:", error)
    }
  }

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
        ) : splitType === "perCoin" ? (
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
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`splits.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address {index + 1}</FormLabel>
                          <div className="space-y-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateAddress(index)}
                              className="w-full"
                            >
                              Get Address
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`splits.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            {...field}
                            value={field.value || 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => append({ address: "", amount: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Split
            </Button>

            <FormField
              control={form.control}
              name="splitAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Amount (for all)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </form>
    </Form>
  )
}
