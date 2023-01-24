import { AlchemyProvider } from "@ethersproject/providers";
import { Logger } from "@ethersproject/logger";
import { BasementProvider } from "../src";

describe("getEnhancedLogs", () => {
  const provider = new AlchemyProvider("homestead");

  const baseFilterOpts = {
    fromBlock: 16426225,
    toBlock: 16426226,
  };
  const ADDRESS = "0x000000000000ad05ccc4f10045630fb830b95127";
  const enhancedProvider = BasementProvider.enhance(provider);
  it("fetches up to the logs limit when given a block range", async () => {
    const logs = await enhancedProvider.getEnhancedLogs(
      {
        ...baseFilterOpts,
        addresses: [ADDRESS],
      },
      { transaction: { from: true, to: true, events: true } }
    );

    const txLog = logs[0];
    expect(logs.length).toBe(1);
    expect(txLog.blockNumber).toBe(baseFilterOpts.fromBlock);
    expect(txLog.address.address.toLowerCase()).toBe(ADDRESS);

    expect(txLog.transaction?.from?.address).toBe(
      "0xD1a8DfBD03E944080F7F136D966Fb62226B603f7"
    );

    expect(txLog.transaction?.to?.address).toBeDefined();
    expect(txLog.transaction?.events).toBeDefined();
  });

  it("throws when given a blockhash", async () => {
    await expect(
      enhancedProvider.getEnhancedLogs({
        blockHash:
          "0x6880c81d8d694454342813defa86b3782043f2134f1c00d37b927861bae75ea5",
      })
    ).rejects.toThrow(Logger.errors.NOT_IMPLEMENTED);
  });

  it("throws when given addresses and address", async () => {
    await expect(
      enhancedProvider.getEnhancedLogs({
        address: ADDRESS,
        addresses: [ADDRESS],
      })
    ).rejects.toThrow(Logger.errors.UNEXPECTED_ARGUMENT);
  });
});
