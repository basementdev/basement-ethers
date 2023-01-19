import {
  UrlJsonRpcProvider,
  Filter,
  Log,
  Network,
} from "@ethersproject/providers";
import { Logger } from "@ethersproject/logger";
import { resolveProperties } from "@ethersproject/properties";
import type { FilterByBlockHash } from "@ethersproject/abstract-provider";
import type { ConnectionInfo } from "@ethersproject/web";
import { BasementSDK, TransactionLogFilter } from "@basementdev/sdk";

const logger = new Logger(process.env.npm_package_version);

function transformFilters(filters: Filter): Partial<TransactionLogFilter> {
  let { address, fromBlock, toBlock, topics } = filters;

  if (fromBlock) {
    fromBlock = +fromBlock;
  }
  if (toBlock) {
    toBlock = +toBlock;
  }

  if (topics) {
    topics = [topics.flat()];
  }
  return {
    topics: topics as string[][],
    addresses: address ? [address] : undefined,
    fromBlock: fromBlock as number,
    toBlock: toBlock as number,
  };
}

export class BasementProvider extends UrlJsonRpcProvider {
  static originalProvider: UrlJsonRpcProvider;
  private sdk: BasementSDK;
  private constructor(provider: UrlJsonRpcProvider, basementApiKey?: string) {
    super(provider.network, provider.apiKey);
    this.sdk = new BasementSDK({ apiKey: basementApiKey });
  }
  async getLogs(
    filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>
  ): Promise<Log[]> {
    await this.getNetwork();
    const params = await resolveProperties({
      filter: this._getFilter(filter),
    });
    const { filter: resolvedFilter } = params;
    if ((resolvedFilter as FilterByBlockHash).blockHash) {
      logger.throwArgumentError(
        "blockHash isn't supported when using the Basement wrapper",
        Logger.errors.NOT_IMPLEMENTED,
        filter
      );
    }
    const transformedFilters = transformFilters(resolvedFilter as Filter);
    const data = await this.sdk.transactionLogs({
      filter: transformedFilters,
    });
    return data.transactionLogs as any;
  }

  static enhance(provider: UrlJsonRpcProvider, basementApiKey?: string) {
    BasementProvider.originalProvider = provider;
    return new BasementProvider(provider, basementApiKey);
  }

  static getUrl(network: Network, apiKey: any): string | ConnectionInfo {
    return (
      BasementProvider.originalProvider.constructor as typeof UrlJsonRpcProvider
    ).getUrl(network, apiKey);
  }
}
