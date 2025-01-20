import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Virtuoso } from "react-virtuoso";
import { useMinima } from "@/hooks/use-minima";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleCheck, Info, SearchIcon } from "lucide-react";
import { untrackCoin } from "@/lib/minima/mds-functions";
import { SearchCoinsDialog } from "../dialogs/search-coins-dialog";
import { CoinCard } from "../tokens/token-card";
import { Nav } from "../nav";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  Form,
} from "../ui/form";
import { trackCoinFormSchema, TrackCoinFormValues } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Hint } from "../hint";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

export const TrackCoins = () => {
  const [activeTab, setActiveTab] = useState<
    | "auto"
    | "manual"
    | "total"
    | "perCoin"
    | "custom"
    | "untrack"
    | "track"
    | null
  >("untrack");
  const [hoveredLink, setHoveredLink] = useState<
    | "auto"
    | "manual"
    | "total"
    | "perCoin"
    | "custom"
    | "untrack"
    | "track"
    | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { trackableCoins } = useMinima();
  const { data: coins } = trackableCoins;

  const filteredCoins = useMemo(() => {
    if (!coins?.response) return [];
    if (!searchQuery) return coins.response;
    return coins.response.filter((coin) =>
      coin.coinid.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coins?.response, searchQuery]);

  const { mutate } = useMutation({
    mutationFn: (coinId: string) => untrackCoin(coinId, "false"),
    onSuccess: (data) => {
      if (data && data.pending) {
        toast.success("Coin untracked", {
          icon: <CircleCheck className="w-4 h-4" />,
          description: "The command is pending",
        });
      } else {
        toast.success("Coin untracked", {
          icon: <CircleCheck className="w-4 h-4" />,
        });
      }
      //TODO: handle not pending and success
    },
    onError: () => {
      toast.error("Failed to untrack coin");
    },
  });

  const handleUntrack = (coinId: string) => {
    mutate(coinId);
  };

  if (!coins?.response) return null;

  return (
    <div className="container mx-auto max-w-2xl flex flex-col gap-4 pb-20">
      <Nav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setHoveredLink={setHoveredLink}
        hoveredLink={hoveredLink}
        mode="untrack"
      />

      {activeTab === "untrack" ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-base">Untrack Coins</h1>
              <p className="text-sm text-muted-foreground">
                Search and select coins to untrack
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2  dark:bg-darkContrast bg-grey10"
              onClick={() => setOpen(true)}
            >
              <SearchIcon className="h-4 w-4" />
              Search Coins
            </Button>
          </div>

          <div style={{ height: "600px" }}>
            <Virtuoso
              className="custom-scrollbar"
              style={{
                height: "100%",
              }}
              data={filteredCoins}
              itemContent={(_, coin) => (
                <div className="mb-2">
                  <CoinCard
                    key={coin.coinid}
                    coin={coin}
                    isSelected={false}
                    onSelect={() => {}}
                    disabled={false}
                    isDisabled={false}
                    mode="untrack"
                    onUntrack={handleUntrack}
                  />
                </div>
              )}
            />
          </div>

          <SearchCoinsDialog
            open={open}
            onOpenChange={setOpen}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            coins={filteredCoins}
            onUntrack={handleUntrack}
          />
        </>
      ) : activeTab === "track" ? (
        <TrackCoin />
      ) : null}
    </div>
  );
};

const TrackCoin = () => {
  const form = useForm<TrackCoinFormValues>({
    resolver: zodResolver(trackCoinFormSchema),
    defaultValues: {
      coinId: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (coinId: string) => untrackCoin(coinId, "true"),
    onSuccess: (data) => {
      if (data && data.pending) {
        toast.success("Coin tracked", {
          icon: <CircleCheck className="w-4 h-4" />,
          description: "The command is pending",
        });
      } else {
        toast.success("Coin tracked", {
          icon: <CircleCheck className="w-4 h-4" />,
        });
      }
      form.reset();
    },
    onError: () => {
      toast.error("Failed to track coin");
    },
  });

  const onSubmit = (values: TrackCoinFormValues) => {
    console.log(values);
    mutate(values.coinId);
  };

  return (
    <Form {...form}>
      <form
        id="track-coin-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="coinId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coin ID</FormLabel>
              <FormControl>
                <div className=" relative flex items-center">
                  <Input
                    type="text"
                    inputMode="text"
                    className="dark:bg-darkContrast bg-grey10"
                    placeholder="0xABC.."
                    {...field}
                  />
                  <div className=" absolute right-2">
                    <Hint
                      side="left"
                      align="center"
                      label="Enter the coin ID to track."
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

        <Button
          type="submit"
          form="track-coin-form"
          className="w-full bg-lightOrange hover:bg-lighterOrange transition-all duration-300 text-black"
        >
          Track Coin
        </Button>
      </form>
    </Form>
  );
};
