import { AlchemyProvider } from "@ethersproject/providers";
import { BasementProvider } from "./provider";

const provider = new AlchemyProvider();
const enhancedProvider = BasementProvider.enhance(provider);

async function main() {
  const logsInfo = {
    // address: "0x000000000000ad05ccc4f10045630fb830b95127",
    fromBlock: 16426225,
    toBlock: 16426226,
    topics: [
      [
        "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f63",
        "0x00000000000000000000000035ffc49e7fefc188dff81db3c717db098294bc24",
      ],
    ],
    // blockHash:
    //   "0xf87c047379a65c745d607a367ffb1ba17e7b49a718229318a36ec6aadc8f7fef",
  };
  const logs = await provider.getLogs({
    ...logsInfo,
  });
  console.log(logs[0].topics);

  const enhancedLogs = await enhancedProvider.getLogs(logsInfo);
  console.log(enhancedLogs);
}

main();
