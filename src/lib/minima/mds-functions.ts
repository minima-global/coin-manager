import {
  Balance,
  MDS,
  CoinsResponse,
  Tokens,
  SendResponse,
} from "@minima-global/mds"
import { Failure, Success } from "../error"
import { ConsolidationFormValues } from "@/components/dialogs/consolidation-dialog"

async function getBalance(): Promise<Balance.Balance> {
  const balance = await MDS.cmd.balance()
  return balance
}

async function getCoins(): Promise<CoinsResponse> {
  const coins = await MDS.cmd.coins()
  return coins
}

async function getCoinsByTokenId(tokenId: string): Promise<CoinsResponse> {
  const coins = await MDS.cmd.coins({
    params: { tokenid: tokenId },
  })

  return coins
}

async function getTokenById(
  tokenId: string
): Promise<Tokens.TokenResponseSingle> {
  const token = await MDS.cmd.tokens({ params: { tokenid: tokenId } })
  return token
}

async function checkConsolidation(
  values: ConsolidationFormValues
): Promise<any> {
  const dryRunResult = await MDS.cmd.consolidate({
    params: {
      tokenid: values.tokenId,
      coinage: values.maxSignatures.toString(),
      maxcoins: values.maxInputs.toString(),
      burn: values.burn.toString(),
      dryrun: "true",
    },
  })

  const { error, response } = dryRunResult

  // Check if there is an error
  if (error) {
    return Failure("Error checking consolidation", "consolidation_error")
  }

  // Check if the txpow is too big TODO: check max size
  if (response.size > 64000) {
    return Failure("Txpow is too big", "txpow_to_big")
  }

  const consolidationResult = await consolidateCoins(values)

  if (consolidationResult.error) {
    return Failure("Error consolidating coins", "consolidation_error")
  }

  console.log("consolidationResult", consolidationResult)

  return Success(consolidationResult)
}

async function consolidateCoins(
  values: ConsolidationFormValues
): Promise<SendResponse> {
  const result = await MDS.cmd.consolidate({
    params: {
      tokenid: values.tokenId,
      coinage: values.minConfirmations.toString(),
      maxcoins: values.maxInputs.toString(),
      burn: values.burn.toString(),
      maxsigs: values.maxSignatures.toString(),
    },
  })

  return result
}

async function balanceByTokenId(tokenId: string): Promise<Balance.Balance> {
  const balance = await MDS.cmd.balance({ params: { tokenid: tokenId } })
  return balance
}

export {
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getTokenById,
  checkConsolidation,
  consolidateCoins,
  balanceByTokenId,
}
