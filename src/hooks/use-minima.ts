import { appContext } from "@/AppContext";
import {
  balanceByTokenId,
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getTokenById,
} from "@/lib/minima/mds-functions";
import type {
  Balance,
  BalanceWithTokenDetails,
  Coin,
  MDSResponse,
  Token,
} from "@minima-global/mds";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useMinima() {
  const { isInited } = useContext(appContext);

  const balance = useQuery<MDSResponse<Balance[]> | null>({
    queryKey: ["balance"],
    queryFn: getBalance,
    enabled: isInited,
    refetchInterval: 5000, // 5 seconds
  });

  const coins = useQuery<MDSResponse<Coin[]> | null>({
    queryKey: ["coins"],
    queryFn: getCoins,
    enabled: isInited,
  });

  const coinsByTokenId = (tokenId: string) => {
    return useQuery<MDSResponse<Coin[]> | null>({
      queryKey: ["coinsByTokenId", tokenId],
      queryFn: () => getCoinsByTokenId(tokenId),
      enabled: isInited,
    });
  };

  const tokenById = (tokenId: string) => {
    return useQuery<MDSResponse<Token> | null>({
      queryKey: ["token", tokenId],
      queryFn: () => getTokenById(tokenId),
      enabled: isInited,
      refetchInterval: 5000, // 5 seconds
    });
  };

  const balanceByTokenIdQuery = (tokenId: string) => {
    return useQuery<MDSResponse<BalanceWithTokenDetails[]> | undefined>({
      queryKey: ["balanceByTokenId", tokenId],
      queryFn: () => balanceByTokenId(tokenId),
      enabled: isInited,
      refetchInterval: 5000, // 5 seconds
    });
  };

  return {
    isInited,
    balance: balance.data,
    coins: coins.data,
    coinsByTokenId,
    tokenById,
    balanceByTokenIdQuery,
  };
}
