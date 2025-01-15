import {
  Balance,
  BalanceWithTokenDetails,
  Coin,
  MDS,
  MDSResponse,
  Token,
  Transaction,
} from "@minima-global/mds";
import { MDSError, Success } from "../error";
import { ConsolidationFormValues } from "@/lib/schemas";
import { SplitFormValues } from "@/lib/schemas";

async function getBalance(): Promise<MDSResponse<Balance[]>> {
  const balance = await MDS.cmd.balance();
  return balance;
}

async function getCoins(): Promise<MDSResponse<Coin[]>> {
  const coins = await MDS.cmd.coins();
  return coins;
}

async function getCoinsByTokenId(
  tokenId: string
): Promise<MDSResponse<Coin[]>> {
  const coins = await MDS.cmd.coins({
    params: { tokenid: tokenId },
  });

  return coins;
}

async function getTokenById(tokenId: string): Promise<MDSResponse<Token>> {
  const token = await MDS.cmd.tokens({ params: { tokenid: tokenId } });
  return token;
}

async function checkConsolidation(
  values: ConsolidationFormValues
): Promise<Success<string | MDSResponse<Transaction>>> {
  const dryRunResult = await MDS.cmd.consolidate({
    params: {
      tokenid: values.tokenId,
      coinage: values.maxSignatures.toString(),
      maxcoins: values.maxInputs.toString(),
      burn: values.burn.toString(),
      dryrun: "true",
    },
  });

  const { error, response } = dryRunResult;

  // Check if there is an error
  if (error) {
    throw new MDSError("Error checking consolidation", "consolidation_error");
  }

  // Check if the txpow is too big TODO: check max size
  if (response.size > 64000) {
    throw new MDSError("Txpow is too big", "txpow_to_big");
  }

  const consolidationResult = await consolidateCoins(values);

  return consolidationResult;
}

async function consolidateCoins(
  values: ConsolidationFormValues
): Promise<Success<string | MDSResponse<Transaction>>> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const result = await MDS.cmd.consolidate({
    params: {
      tokenid: values.tokenId,
      coinage: values.minConfirmations.toString(),
      maxcoins: values.maxInputs.toString(),
      burn: values.burn.toString(),
      maxsigs: values.maxSignatures.toString(),
    },
  });

  const pendingId = result.pendinguid;

  if (result.error && !pendingId) {
    if (result.error.includes("TXPOW")) {
      throw new MDSError(
        "Transaction is too large to be processed",
        "txpow_to_big"
      );
    }
    throw new MDSError("Failed to consolidate coins", "consolidation_error");
  }

  if (pendingId) {
    return Success(pendingId);
  }

  return Success(result);
}

async function balanceByTokenId(
  tokenId: string
): Promise<MDSResponse<BalanceWithTokenDetails[]>> {
  const balance = await MDS.cmd.balance({
    params: { tokenid: tokenId, tokendetails: "true" },
  });

  return balance;
}

async function manualConsolidation(coinIds: string[]): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const TXN_ID =
    "manual-consolidation-" + Math.random().toString(36).substring(2, 15);
  let totalAmount: number = 0;

  if (coinIds.length === 0) {
    throw new Error("No coins to consolidate");
  }

  await MDS.cmd.txncreate({
    params: {
      id: TXN_ID,
    },
  });

  for (const coinId of coinIds) {
    const coinAmount = await MDS.cmd.coins({ params: { coinid: coinId } });

    if (coinAmount.error) {
      throw new Error("Error getting coin");
    }

    totalAmount += parseFloat(
      coinAmount.response[0].tokenamount || coinAmount.response[0].amount
    );

    const input = await MDS.cmd.txninput({
      params: {
        id: TXN_ID,
        coinid: coinId,
      },
    });

    if (input.error) {
      throw new Error("Error adding coin to txn");
    }
  }

  const coin = await MDS.cmd.coins({ params: { coinid: coinIds[0] } });

  if (coin.error) {
    throw new Error("Error getting coin");
  }

  const address = coin.response[0].address;

  let MxAddress: string;

  const miniAddress = await MDS.cmd.checkaddress({ params: { address } });

  if (miniAddress.error) {
    throw new Error("Error checking address");
  }

  MxAddress = miniAddress.response.Mx;

  const output = await MDS.cmd.txnoutput({
    params: {
      address: MxAddress,
      amount: totalAmount.toString(),
      id: TXN_ID,
      tokenid: coin.response[0].tokenid,
    },
  });

  if (output.error) {
    throw new Error("Error adding output");
  }

  const post = await MDS.cmd.txnsign({
    params: {
      id: TXN_ID,
      publickey: "auto",
      txnpostauto: "true",
    },
  });

  const pendingId = post.pendinguid;

  if (pendingId) {
    return Success(pendingId);
  }

  return Success(post);
}

async function splitCoins(values: SplitFormValues): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const address = await MDS.cmd.getaddress();

  if (address.error) {
    throw new MDSError("Error getting address");
  }

  const MxAddress = address.response.miniaddress;
  let result: MDSResponse<Transaction>;

  if (values.splitType === "perCoin") {
    const totalAmount = values.numberOfCoins * values.amountPerCoin;
    result = await MDS.cmd.send({
      params: {
        tokenid: values.tokenId,
        amount: totalAmount.toString(),
        split: values.numberOfCoins.toString(),
        address: MxAddress,
      },
    });
  } else if (values.splitType === "total") {
    result = await MDS.cmd.send({
      params: {
        tokenid: values.tokenId,
        amount: values.totalAmount.toString(),
        split: values.numberOfCoins.toString(),
        address: MxAddress,
      },
    });
  } else if (values.splitType === "custom") {
    const multi = values.splits.map((split) => {
      return `${split.address}:${split.amount}`;
    });
    if (multi.length * values.splitAmount > 15) {
      throw new MDSError("Too many outputs", "too_many_outputs");
    }
    result = await MDS.cmd.send({
      params: {
        split: values.splitAmount.toString(),
        multi: multi,
        tokenid: values.tokenId,
      },
    });
  } else {
    throw new MDSError("Invalid split type");
  }

  const pendingId = result?.pendinguid;

  if (result?.error && !pendingId) {
    if (result.error.includes("TXPOW")) {
      throw new MDSError(
        "Transaction is too large to be processed",
        "txpow_to_big"
      );
    }
    throw new MDSError("Failed to consolidate coins", "consolidation_error");
  }

  if (pendingId) {
    return Success(pendingId);
  }

  return Success(result);
}

async function getAddress(): Promise<any> {
  const address = await MDS.cmd.getaddress();
  return address;
}

async function validateToken(tokenId: string): Promise<boolean> {
  const res = await MDS.cmd.tokenvalidate({
    params: {
      tokenid: tokenId,
    },
  });

  if (!res.status) {
    return true;
  }
  if (res.response.web.valid) {
    return true;
  } else {
    return false;
  }
}

async function isNodeLocked(): Promise<boolean> {
  const res = await MDS.cmd.status();

  if (!res.status) {
    throw new MDSError("Something went wrong", "node_locked");
  }

  if (res.response.locked) {
    return true;
  }

  return false;
}

export {
  isNodeLocked,
  manualConsolidation,
  validateToken,
  getBalance,
  getCoins,
  getCoinsByTokenId,
  getTokenById,
  checkConsolidation,
  consolidateCoins,
  balanceByTokenId,
  splitCoins,
  getAddress,
};
