import { BalanceWithTokenDetails, Coin, MDSResponse } from "@minima-global/mds";

export const getDisabledCoins = (
  balance: MDSResponse<BalanceWithTokenDetails[]> | undefined,
  coins: MDSResponse<Coin[]>
) => {
  if (!balance) return new Set<string>();

  const confirmedAmount = Number(balance.response[0].confirmed);
  const sendableAmount = Number(balance.response[0].sendable);
  const difference = confirmedAmount - sendableAmount;

  if (difference > 0) {
    const disabledCoinIds = new Set<string>();

    // First check for exact matches
    const exactMatches = coins.response.filter(
      (c) => Number(c.tokenamount || c.amount) === difference
    );

    if (exactMatches.length > 0) {
      exactMatches.forEach((c) => disabledCoinIds.add(c.coinid));
      return disabledCoinIds;
    }

    // If no exact matches, look for combinations of coins
    let remainingDifference = difference;
    const sortedCoins = [...coins.response].sort(
      (a, b) =>
        Number(b.tokenamount || b.amount) - Number(a.tokenamount || a.amount)
    );

    for (const coin of sortedCoins) {
      const coinAmount = Number(coin.tokenamount || coin.amount);
      if (coinAmount <= remainingDifference) {
        disabledCoinIds.add(coin.coinid);
        remainingDifference -= coinAmount;

        if (remainingDifference === 0) {
          break;
        }
      }
    }

    return disabledCoinIds;
  }
  return new Set<string>();
};
