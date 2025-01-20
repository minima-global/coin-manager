import {
  Balance,
  BalanceWithTokenDetails,
  Coin,
  MDSResponse,
} from "@minima-global/mds";
import { TokenDisplay } from "./token-display";
import { CopyButton } from "../copy-button";
import { Checkbox } from "../ui/checkbox";
import { CoinInfoDialog } from "../dialogs/coin-info";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import {
  fetchIPFSImageUri,
  makeTokenImage,
} from "@/lib/minima/make-token-image";
import { CircleMinus, Check, Info } from "lucide-react";
import { Hint } from "../hint";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

interface TokenCardProps {
  token: MDSResponse<BalanceWithTokenDetails[]>;
  isLinkEnabled: boolean;
  type: "showcase" | "token";
  balance: MDSResponse<BalanceWithTokenDetails[]>;
  coins: MDSResponse<Coin[]>;
  tab?: string;
  sendableCoins: MDSResponse<Coin[]>;
}

export function TokenCard({
  token,
  isLinkEnabled,
  type,
  balance,
  tab,
  coins,
  sendableCoins,
}: TokenCardProps) {
  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(JSON.stringify(token, null, 2));
  };

  const CardContent = (
    <>
      {token.response.map((token) => (
        <TokenCardItem
          key={token.tokenid}
          token={token}
          type={type}
          balance={balance}
          tab={tab}
          coins={coins}
          onCopy={handleCopyToken}
          sendableCoins={sendableCoins}
        />
      ))}
    </>
  );

  return isLinkEnabled ? (
    <>{CardContent}</>
  ) : (
    <div className="w-full">{CardContent}</div>
  );
}

interface TokenCardItemProps {
  token: Balance;
  type: "showcase" | "token";
  totalCoins?: number;
  balance: MDSResponse<BalanceWithTokenDetails[]>;
  coins: MDSResponse<Coin[]>;
  tab?: string;
  onCopy: () => Promise<void>;
  sendableCoins: MDSResponse<Coin[]>;
}

function TokenCardItem({
  token,
  type,

  balance,
  coins,
  tab,
  onCopy,
  sendableCoins,
}: TokenCardItemProps) {
  const isMinima = token.tokenid === "0x00";
  const tokenName =
    typeof token.token === "string"
      ? token.token
      : token.token.name || "Unknown Token";

  return (
    <div>
      <div className="flex items-center justify-between w-full cursor-pointer bg-grey10 dark:bg-darkContrast relative p-3 rounded mb-2">
        <div className="flex items-center space-x-2">
          <TokenIcon token={token} isMinima={isMinima} />
          <div>
            <p className="font-medium">{tokenName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/tokens/${token.tokenid}/info`}>
            <Button
              variant="outline"
              className={cn(
                "h-auto px-5 transition-all duration-300 dark:bg-mediumDarkContrast bg-grey10 hover:bg-grey10"
              )}
            >
              <Info className="w-4 h-4" />
            </Button>
          </Link>
          <CopyButton onCopy={onCopy} />
        </div>
      </div>

      <div className="p-4 space-y-4 bg-grey10 dark:bg-darkContrast">
        {type === "showcase" && (
          <TokenDisplay
            token={token}
            balance={balance}
            tab={tab}
            coins={coins}
            sendableCoins={sendableCoins}
          />
        )}
      </div>
    </div>
  );
}

function TokenIcon({ token, isMinima }: { token: Balance; isMinima: boolean }) {
  const [processedUrls, setProcessedUrls] = useState<{
    [tokenId: string]: string;
  }>({});

  useEffect(() => {
    const processTokenUrls = async () => {
      if (token?.token) {
        const urlResults: { [tokenId: string]: string } = {};

        if (
          typeof token.token === "object" &&
          "url" in token.token &&
          token.token.url
        ) {
          let url = decodeURIComponent(token.token.url);
          if (url.startsWith("<artimage>", 0)) {
            url = makeTokenImage(url, token.tokenid) || url;
          } else if (url.startsWith("https://ipfs.io/ipns/")) {
            url = (await fetchIPFSImageUri(url)) || url;
          }
          urlResults[token.tokenid] = url;
        } else {
          urlResults[token.tokenid] = `https://robohash.org/${token.tokenid}`;
        }

        setProcessedUrls(urlResults);
      }
    };

    processTokenUrls();
  }, [token]);

  if (isMinima) {
    return (
      <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded overflow-hidden">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" fill="white" />
          <path
            d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z"
            fill="black"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="aspect-square w-12 h-12 overflow-hidden">
      <img
        alt="token-icon"
        src={
          processedUrls[token.tokenid] ||
          `https://robohash.org/${token.tokenid}`
        }
        className="border-grey80 dark:border-mediumDarkContrast border rounded w-full h-full"
      />
    </div>
  );
}

interface CoinCardProps {
  coin: Coin;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  isDisabled?: boolean;
  mode?: "untrack";
  onUntrack?: (coinId: string) => void;
}

export const CoinCard = ({
  coin,
  isSelected,
  onSelect,
  isDisabled,
  mode,
  onUntrack,
}: CoinCardProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleUntrackClick = useCallback(() => {
    if (!isConfirming) {
      setIsConfirming(true);
      const timeout = setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
      setTimeoutId(timeout);
    } else {
      if (onUntrack) {
        onUntrack(coin.coinid);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Show green confirmation state
      setIsConfirmed(true);

      // After 3 seconds, start the exit sequence
      const confirmTimeout = setTimeout(() => {
        setIsConfirming(false); // This triggers the slide animation

        // After the slide animation, remove the green background
        setTimeout(() => {
          setIsConfirmed(false);
        }, 200); // Match the slide animation duration
      }, 3000);

      setTimeoutId(confirmTimeout);
    }
  }, [isConfirming, coin.coinid, onUntrack, timeoutId]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <>
      <div
        className={cn(
          "flex flex-col dark:bg-darkContrast bg-grey10",
          isDisabled ? "opacity-50" : ""
        )}
      >
        <div className="flex items-center gap-4 p-4 w-full">
          {mode !== "untrack" && (
            <div className="flex-shrink-0">
              <Checkbox
                disabled={isDisabled}
                id={`token-${coin.coinid}`}
                checked={isSelected}
                onCheckedChange={() => {
                  onSelect(coin.coinid);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0 max-w-[60%]">
            <p className="text-xs truncate text-muted-foreground flex items-center">
              <span className="font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb] inline-block w-[40px] text-center flex-shrink-0">
                ID:
              </span>
              <span className="truncate" title={coin.coinid}>
                {coin.coinid}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 min-w-[140px] justify-end">
            <AnimatePresence mode="wait">
              {!isConfirming && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-medium text-xs whitespace-nowrap text-right flex-1"
                >
                  {coin.tokenamount !== undefined
                    ? Number(coin.tokenamount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : Number(coin.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-1 flex-shrink-0">
              {mode === "untrack" && (
                <div className="relative">
                  <Hint label={isConfirming ? "Confirm untrack" : "Untrack"}>
                    <button
                      onClick={handleUntrackClick}
                      className={cn(
                        "relative h-6 flex items-center justify-center px-2 overflow-hidden transition-colors duration-200",
                        isConfirming && isConfirmed
                          ? "bg-emerald-100 dark:bg-emerald-900/30 rounded min-w-[72px]"
                          : "min-w-[28px]"
                      )}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isConfirming ? (
                          <motion.div
                            key="confirm"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex items-center gap-1"
                          >
                            <Check
                              className={cn(
                                "w-3 h-3",
                                isConfirmed
                                  ? "text-emerald-500"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-medium",
                                isConfirmed
                                  ? "text-emerald-500"
                                  : "text-muted-foreground"
                              )}
                            >
                              Confirm
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="untrack"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            <CircleMinus className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </Hint>
                </div>
              )}
              {!isConfirming && (
                <div className="flex-shrink-0 mt-1">
                  <CoinInfoDialog coin={coin} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
