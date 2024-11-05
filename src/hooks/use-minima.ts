import { appContext } from "@/AppContext"
import {
  balanceByTokenId,
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getTokenById,
} from "@/lib/minima/mds-functions"
import { Balance, CoinsResponse, Tokens } from "@minima-global/mds"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

export function useMinima() {
  const { isInited } = useContext(appContext)

  const balance = useQuery<Balance.Balance | null>({
    queryKey: ["balance"],
    queryFn: getBalance,
    enabled: isInited,
    refetchInterval: 5000, // 5 seconds
  })

  const coins = useQuery<CoinsResponse | null>({
    queryKey: ["coins"],
    queryFn: getCoins,
    enabled: isInited,
  })

  const coinsByTokenId = (tokenId: string) => {
    return useQuery<CoinsResponse | null>({
      queryKey: ["coinsByTokenId", tokenId],
      queryFn: () => getCoinsByTokenId(tokenId),
      enabled: isInited,
    })
  }

  const tokenById = (tokenId: string) => {
    return useQuery<Tokens.TokenResponseSingle | null>({
      queryKey: ["token", tokenId],
      queryFn: () => getTokenById(tokenId),
      enabled: isInited,
      refetchInterval: 5000, // 5 seconds
    })
  }

  const balanceByTokenIdQuery = (tokenId: string) => {
    return useQuery<Balance.BalanceWithTokenDetails | undefined>({
      queryKey: ["balanceByTokenId", tokenId],
      queryFn: () => balanceByTokenId(tokenId),
      enabled: isInited,
      refetchInterval: 5000, // 5 seconds
    })
  }

  return {
    isInited,
    balance: balance.data,
    coins: coins.data,
    coinsByTokenId,
    tokenById,
    balanceByTokenIdQuery,
  }
}
