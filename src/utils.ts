import {
  BasementSDK,
  TransactionLogFilter,
  TransactionLogsQueryIncludeOptions,
} from "@basementdev/sdk";
import { Filter, FilterByBlockHash } from "@ethersproject/abstract-provider";

export function transformFilters(
  filters: Filter | FilterByBlockHash
): Partial<TransactionLogFilter> {
  const { address, blockHash } = filters as FilterByBlockHash;
  let { fromBlock, toBlock } = filters as Filter;

  if (fromBlock) {
    fromBlock = +fromBlock;
  }
  if (toBlock) {
    toBlock = +toBlock;
  }

  return {
    topics: filters.topics as string[][],
    addresses: address ? [address] : undefined,
    blockHashes: blockHash ? [blockHash] : undefined,
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
      include: { ...include, blockHash: true },
    });
    res.push(...data.transactionLogs);
    afterCursor = data.cursors.after;
  } while (afterCursor);
  return res;
}
