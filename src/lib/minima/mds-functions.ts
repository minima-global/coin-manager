import {
  Balance,
  MDS,
  CoinsResponse,
  Tokens,
  SendResponse,
} from "@minima-global/mds"
import { Failure, Success } from "../error"
import { ConsolidationFormValues } from "@/components/dialogs/consolidation-dialog"
import { SplitFormValues } from "@/components/tokens/split-form"

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
    params: { tokenid: tokenId, sendable: "true" },
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

async function balanceByTokenId(
  tokenId: string
): Promise<Balance.BalanceWithTokenDetails> {
  const balance = await MDS.cmd.balance({
    params: { tokenid: tokenId, tokendetails: "true" },
  })
  return balance
}

async function getConsolidationPreview(coinIds: string[]): Promise<any> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const TXN_ID = "manual-consolidation"
    let totalAmount: number = 0

    // make sure there are coins to add
    if (coinIds.length === 0) {
      throw new Error("No coins to consolidate")
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
        throw new Error("Error getting coin")
      }

      totalAmount += parseFloat(coinAmount.response[0].tokenamount)

      const input = await MDS.cmd.txninput({
        params: {
          id: TXN_ID,
          coinid: coinId,
        },
      })

      if (input.error) {
        throw new Error("Error adding coin to txn")
      }
    }

    // get an address from the coin
    const coin = await MDS.cmd.coins({ params: { coinid: coinIds[0] } })

    if (coin.error) {
      throw new Error("Error getting coin")
    }

    const address = coin.response[0].address

    // check the address
    let MxAddress: string

    const miniAddress = await MDS.cmd.checkaddress({ params: { address } })

    if (miniAddress.error) {
      throw new Error("Error checking address")
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
      throw new Error("Error adding output")
    }

    // sign the txn
    const post = await MDS.cmd.txnsign({
      params: {
        id: TXN_ID,
        publickey: "auto",
      },
    })

    if (post.error) {
      throw new Error("Error")
    }

    // post the txn
    const postResult = await MDS.cmd.txnpost({
      params: {
        id: TXN_ID,
        auto: "true",
        txndelete: "true",
      },
    })

    // return the result
    return postResult
  } catch (error) {
    throw error
  }
}

async function splitCoins(values: SplitFormValues): Promise<any> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const address = await MDS.cmd.getaddress()

    if (address.error) {
      throw new Error("Error getting address")
    }

    const MxAddress = address.response.miniaddress
    let result

    if (values.splitType === "perCoin") {
      const totalAmount = values.numberOfCoins * values.amountPerCoin
      result = await MDS.cmd.send({
        params: {
          tokenid: values.tokenId,
          amount: totalAmount.toString(),
          split: values.numberOfCoins.toString(),
          address: MxAddress,
        },
      })
    } else if (values.splitType === "total") {
      result = await MDS.cmd.send({
        params: {
          tokenid: values.tokenId,
          amount: values.totalAmount.toString(),
          split: values.numberOfCoins.toString(),
          address: MxAddress,
        },
      })
    } else {
      throw new Error("Invalid split type")
    }

    if (result.error) {
      throw new Error(result.error)
    }

    return result
  } catch (error) {
    throw error
  }
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
  splitCoins,
}
