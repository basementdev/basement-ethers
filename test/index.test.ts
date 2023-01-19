import { AlchemyProvider } from "@ethersproject/providers";
import { BasementProvider } from "../src";

describe("Basement <-> Ethers.js", () => {
  const provider = new AlchemyProvider();
  const enhancedProvider = BasementProvider.enhance(provider);
  it("getLogs", async () => {
    const logs = await enhancedProvider.getLogs({
      fromBlock: 16426225,
      toBlock: 16426226,
    });
    expect(logs.length).toBeGreaterThan(1);
  });
});
