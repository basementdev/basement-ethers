import {
  BasementSDK,
  TransactionLogFilter,
  TransactionLogsQueryIncludeOptions,
} from "@basementdev/sdk";
import { Filter } from "@ethersproject/abstract-provider";

export function transformFilters(
  filters: Filter
): Partial<TransactionLogFilter> {
  const { address } = filters;
  let { fromBlock, toBlock } = filters;

  if (fromBlock) {
    fromBlock = +fromBlock;
  }
  if (toBlock) {
    toBlock = +toBlock;
  }

  return {
    topics: filters.topics as string[][],
    addresses: address ? [address] : undefined,
    fromBlock: fromBlock as number,
    toBlock: toBlock as number,
  };
}

export async function fetchLogsFromPaginatedQuery(
  sdk: BasementSDK,
  filters: Partial<TransactionLogFilter>,
  include?: TransactionLogsQueryIncludeOptions
) {
  const limit = 500;
  const res = [];
  let afterCursor: string | undefined;
  do {
    // eslint-disable-next-line no-await-in-loop
    const data = await sdk.transactionLogs({
      filter: filters,
      limit,
      after: afterCursor,
      include,
    });
    res.push(...data.transactionLogs);
    afterCursor = data.cursors.after;
  } while (afterCursor);
  return res;
}
