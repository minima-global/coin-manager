import {
  Balance,
  BalanceWithTokenDetails,
  Coin,
  MDSResponse,
} from "@minima-global/mds";
import { Link } from "@tanstack/react-router";
import { TokenDisplay } from "./token-display";
import { CopyButton } from "../copy-button";
import { Checkbox } from "../ui/checkbox";
import { CoinInfoDialog } from "../dialogs/coin-info";
import { cn } from "@/lib/utils";

interface TokenCardProps {
  token: MDSResponse<BalanceWithTokenDetails[]>;
  isLinkEnabled: boolean;
  type: "showcase" | "token";
  totalCoins?: number;
  balance?: Balance[];
  tab?: string;
}

export function TokenCard({
  token,
  isLinkEnabled,
  type,
  totalCoins,
  balance,
  tab,
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
          totalCoins={totalCoins}
          balance={balance}
          tab={tab}
          onCopy={handleCopyToken}
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
  balance?: Balance[];
  tab?: string;
  onCopy: () => Promise<void>;
}

function TokenCardItem({
  token,
  type,
  totalCoins,
  balance,
  tab,
  onCopy,
}: TokenCardItemProps) {
  const isMinima = token.tokenid === "0x00";
  const tokenName =
    typeof token.token === "string"
      ? token.token
      : token.token.name || "Unknown Token";

  return (
    <Link to="/tokens/$tokenId" params={{ tokenId: token.tokenid }}>
      <div className="flex items-center justify-between w-full cursor-pointer bg-grey10 dark:bg-darkContrast relative p-3 rounded mb-2">
        <div className="flex items-center space-x-2">
          <TokenIcon token={token} isMinima={isMinima} />
          <div>
            <p className="font-medium">{tokenName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CopyButton onCopy={onCopy} />
        </div>
      </div>

      <div className="p-4 space-y-4 bg-grey10 dark:bg-darkContrast">
        {type === "showcase" && (
          <TokenDisplay
            token={token}
            balance={balance}
            totalCoins={totalCoins}
            tab={tab}
          />
        )}
      </div>
    </Link>
  );
}

function TokenIcon({ token, isMinima }: { token: Balance; isMinima: boolean }) {
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
          typeof token.token === "object" &&
          "url" in token.token &&
          token.token.url.length
            ? decodeURIComponent(token.token.url)
            : `https://robohash.org/${token.tokenid}`
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
}

export const CoinCard = ({
  coin,
  isSelected,
  onSelect,
  disabled,
}: CoinCardProps) => {
  return (
    <>
      <div
        className={cn(
          "flex flex-col dark:bg-darkContrast bg-grey10",
          disabled ? "opacity-50" : "",
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Checkbox
              disabled={disabled}
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
          <p className="text-xs truncate text-muted-foreground ml-2">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb]",
              )}
            >
              Coin ID:
            </span>
            {coin.coinid}
          </p>
          <div className="flex items-center gap-2">
            <p className="font-medium text-xs tr">
              {coin.tokenamount
                ? Number(coin.tokenamount).toFixed(2)
                : coin.amount.includes(".")
                  ? coin.amount.split(".")[0] +
                    "." +
                    coin.amount.split(".")[1].slice(0, 2)
                  : coin.amount}
            </p>
            <CoinInfoDialog coin={coin} />
          </div>
        </div>
      </div>
    </>
  );
};
