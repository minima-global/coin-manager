import { appContext } from "@/AppContext";
import {
  balanceByTokenId,
  getAddresses,
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getSendableCoinsByTokenId,
  getTokenById,
  getTrackableCoins,
  isNodeLocked,
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

  const nodeLocked = useQuery<boolean>({
    queryKey: ["nodeLocked"],
    queryFn: isNodeLocked,
    enabled: isInited,
    refetchInterval: 5000, // 5 seconds
  });

  const coins = useQuery<MDSResponse<Coin[]> | null>({
    queryKey: ["coins"],
    queryFn: getCoins,
    enabled: isInited,
  });

  const addresses = (tokenId: string, showLockedCoins: boolean = false) => {
    return useQuery<Record<string, MDSResponse<Coin[]> | null>>({
      queryKey: ["addresses", tokenId, showLockedCoins],
      queryFn: () => getAddresses(tokenId, showLockedCoins),
      enabled: isInited,
    });
  };

  const coinsByTokenId = (tokenId: string) => {
    return useQuery<MDSResponse<Coin[]> | null>({
      queryKey: ["coinsByTokenId", tokenId],
      queryFn: () => getCoinsByTokenId(tokenId),
      enabled: isInited,
    });
  };

  const sendableCoinsByTokenIdQuery = (tokenId: string) => {
    return useQuery<MDSResponse<Coin[]> | null>({
      queryKey: ["sendableCoinsByTokenId", tokenId],
      queryFn: () => getSendableCoinsByTokenId(tokenId),
      enabled: isInited,
    });
  };

  const trackableCoins = useQuery<MDSResponse<Coin[]> | null>({
    queryKey: ["trackableCoins"],
    queryFn: getTrackableCoins,
    enabled: isInited,
  });

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
    nodeLocked,
    addresses,
    coins: coins.data,
    coinsByTokenId,
    sendableCoinsByTokenIdQuery,
    tokenById,
    balanceByTokenIdQuery,
    trackableCoins,
  };
}
