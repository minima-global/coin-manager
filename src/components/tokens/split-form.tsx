import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Info, Plus, Trash2 } from "lucide-react";
import { getAddress } from "@/lib/minima/mds-functions";
import { SplitFormValues } from "@/lib/schemas";
import { Hint } from "../hint";

interface SplitFormProps {
  onSubmit: (values: SplitFormValues) => void;
  form: UseFormReturn<SplitFormValues>;
  splitType: "total" | "perCoin" | "custom";
}

export function SplitForm({ onSubmit, form, splitType }: SplitFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "splits",
  });

  const handleGenerateAddress = async (index: number) => {
    try {
      const addressResponse = await getAddress();
      if (!addressResponse.error) {
        form.setValue(
          `splits.${index}.address`,
          addressResponse.response.miniaddress
        );
      }
    } catch (error) {
      console.error("Error generating address:", error);
    }
  };

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
                  <FormLabel>Amount</FormLabel>

                  <FormControl>
                    <div className=" relative flex items-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="dark:bg-darkContrast bg-grey10"
                        {...field}
                      />
                      <div className="absolute right-2">
                        <Hint
                          side="left"
                          align="center"
                          label="Enter the total amount to split into separate coins."
                        >
                          <Info className="h-4 w-4" />
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
              name="numberOfCoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split</FormLabel>

                  <FormControl>
                    <div className=" relative flex items-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="dark:bg-darkContrast bg-grey10"
                        min={2}
                        {...field}
                      />
                      <div className=" absolute right-2">
                        <Hint
                          side="left"
                          align="center"
                          label="Enter the number of coins to split the amount into."
                        >
                          <Info className="h-4 w-4" />
                        </Hint>
                      </div>
                    </div>
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
                    <div className=" relative flex items-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="dark:bg-darkContrast bg-grey10"
                        min={2}
                        {...field}
                      />
                      <div className=" absolute right-2">
                        <Hint
                          side="left"
                          align="center"
                          label="Enter the number of coins you would like to receive."
                        >
                          <Info className="h-4 w-4" />
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
              name="amountPerCoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount per Coin</FormLabel>
                  <FormControl>
                    <div className=" relative flex items-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="dark:bg-darkContrast bg-grey10"
                        {...field}
                      />
                      <div className=" absolute right-2">
                        <Hint
                          side="left"
                          align="center"
                          label="Enter the amount of Minima or custom tokens per coin."
                        >
                          <Info className="h-4 w-4" />
                        </Hint>
                      </div>
                    </div>
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
                              <div className=" relative flex items-center">
                                <Input
                                  type="text"
                                  inputMode="text"
                                  className="dark:bg-darkContrast bg-grey10"
                                  {...field}
                                />
                                <div className=" absolute right-2 z-10 bg-grey10 dark:bg-darkContrast  flex items-center top-1 bottom-1">
                                  <Hint
                                    side="left"
                                    align="center"
                                    label="Enter the address to send the split to."
                                  >
                                    <Info className="h-4 w-4" />
                                  </Hint>
                                </div>
                              </div>
                            </FormControl>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateAddress(index)}
                            className="w-full bg-grey40 dark:bg-mediumDarkContrast hover:bg-grey40 "
                          >
                            Use one of my addresses
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-full bg-grey40 dark:bg-mediumDarkContrast hover:bg-grey40 mt-8 px-4"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`splits.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className=" relative flex items-center">
                            <Input
                              type="number"
                              inputMode="numeric"
                              className="dark:bg-darkContrast bg-grey10"
                              step="0.000001"
                              {...field}
                              value={field.value || 0}
                            />
                            <div className=" absolute right-2">
                              <Hint
                                side="left"
                                align="center"
                                label="Enter the total amount to split into separate coins."
                              >
                                <Info className="h-4 w-4" />
                              </Hint>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full bg-grey40 dark:bg-mediumDarkContrast hover:bg-grey40"
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
                  <FormLabel>Number of coins (each)</FormLabel>
                  <FormControl>
                    <div className=" relative flex items-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="dark:bg-darkContrast bg-grey10"
                        step="0.000001"
                        {...field}
                      />
                      <div className=" absolute right-2">
                        <Hint
                          side="left"
                          align="center"
                          label="Each recipient will receive their amount split into this number of coins"
                        >
                          <Info className="h-4 w-4" />
                        </Hint>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </form>
    </Form>
  );
}
