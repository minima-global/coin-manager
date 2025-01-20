import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Virtuoso } from "react-virtuoso";
import { useMinima } from "@/hooks/use-minima";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleCheck, Info, SearchIcon, AlertTriangle } from "lucide-react";
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
import { Alert, AlertDescription } from "../ui/alert";

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
    onMutate: () => {
      return toast.loading("Untracking coin...", {
        duration: Infinity,
        description: "This may take a few seconds",
        className: "text-black dark:text-white",
      });
    },
    onSuccess: (data, _, toastId) => {
      if (data && data.pending) {
        toast.dismiss(toastId);
        toast.success("Coin untracked", {
          icon: <CircleCheck className="w-4 h-4" />,
          description: "The command is pending",
        });
      } else {
        toast.dismiss(toastId);
        toast.success("Coin untracked", {
          icon: <CircleCheck className="w-4 h-4" />,
        });
      }
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
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

          <TrackCoin variant="untrack" />

          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <AlertDescription>
              Untracking coins via address in read mode can cause many pending
              requests. To avoid this, please put your dapp in write mode.
            </AlertDescription>
          </Alert>

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
        <TrackCoin variant="track" />
      ) : null}
    </div>
  );
};

const TrackCoin = ({ variant }: { variant: "track" | "untrack" }) => {
  const form = useForm<TrackCoinFormValues>({
    resolver: zodResolver(trackCoinFormSchema),
    defaultValues: {
      value: "",
      variant: variant,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (coinId: string) =>
      untrackCoin(coinId, variant === "track" ? "true" : "false"),
    onMutate: () => {
      return toast.loading(
        variant === "track" ? "Tracking coin..." : "Untracking coin(s)...",
        {
          duration: Infinity,
          description: "This may take a few seconds",
          className: "text-black dark:text-white",
        }
      );
    },
    onSuccess: (data, _, toastId) => {
      toast.dismiss(toastId);
      if (data && data.pending) {
        toast.success(
          variant === "track" ? "Coin tracked" : "Coin(s) untracked",
          {
            icon: <CircleCheck className="w-4 h-4" />,
            description: "The command is pending",
          }
        );
      } else {
        toast.success(
          variant === "track" ? "Coin tracked" : "Coin(s) untracked",
          {
            icon: <CircleCheck className="w-4 h-4" />,
          }
        );
      }
      form.reset();
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to untrack coin(s)");
    },
  });

  const onSubmit = (values: TrackCoinFormValues) => {
    mutate(values.value);
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {variant === "track" ? "Coin ID" : "Coin ID or Address"}
              </FormLabel>
              <FormControl>
                <div className=" relative flex items-center">
                  <Input
                    type="text"
                    inputMode="text"
                    className="dark:bg-darkContrast bg-grey10"
                    placeholder={
                      variant === "track" ? "0xABC.." : "0xABC.. or Mx09.."
                    }
                    {...field}
                  />
                  <div className=" absolute right-2">
                    <Hint
                      side="left"
                      align="center"
                      label={
                        variant === "track"
                          ? "Enter the coin ID to track."
                          : "Enter the coin ID or address to track."
                      }
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
          {variant === "track" ? "Track Coin" : "Untrack Coin(s)"}
        </Button>
      </form>
    </Form>
  );
};
