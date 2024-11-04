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

async function getConsolidationPreview(coinIds: string[]): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const TXN_ID = "manual-consolidation"
  let totalAmount: number = 0

  // make sure there are coins to add
  if (coinIds.length === 0) {
    return Failure("No coins to consolidate", "consolidation_error")
  }

  // Create the txn
  await MDS.cmd.txncreate({
    params: {
      id: TXN_ID,
    },
  })

  // get the total amount of the coins and add them to the txn
  for (const coinId of coinIds) {
    const coinAmount = await MDS.cmd.coins({ params: { coinid: coinId } })

    if (coinAmount.error) {
      return Failure("Error getting coin", "consolidation_error")
    }

    totalAmount += parseFloat(coinAmount.response[0].tokenamount)

    const input = await MDS.cmd.txninput({
      params: {
        id: TXN_ID,
        coinid: coinId,
      },
    })

    if (input.error) {
      return Failure("Error adding coin to txn", "consolidation_error")
    }
  }

  // get an address from the coin
  const coin = await MDS.cmd.coins({ params: { coinid: coinIds[0] } })

  if (coin.error) {
    return Failure("Error getting coin", "consolidation_error")
  }

  const address = coin.response[0].address

  // check the address
  let MxAddress: string

  const miniAddress = await MDS.cmd.checkaddress({ params: { address } })

  if (miniAddress.error) {
    return Failure("Error checking address", "consolidation_error")
  }

  MxAddress = miniAddress.response.Mx

  // create the output
  const output = await MDS.cmd.txnoutput({
    params: {
      address: MxAddress,
      amount: totalAmount.toString(),
      id: TXN_ID,
      tokenid: coin.response[0].tokenid,
    },
  })

  if (output.error) {
    return Failure("Error adding output", "consolidation_error")
  }

  // sign the txn
  const post = await MDS.cmd.txnsign({
    params: {
      id: TXN_ID,
      publickey: "auto",
    },
  })

  if (post.error) {
    return Failure("Error", "consolidation_error")
  }

  // post the txn
  const postResult = await MDS.cmd.txnpost({
    params: {
      id: TXN_ID,
      auto: "true",
      txndelete: "true",
    },
  })

  console.log("Actual size", postResult.response.size)

  // return the result
  return Success(postResult)
}

export {
  getConsolidationPreview,
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getTokenById,
  checkConsolidation,
  consolidateCoins,
  balanceByTokenId,
}
