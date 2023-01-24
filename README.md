# Basement ethers.js provider wrapper

## Installation

**npm:**

```bash
npm install @basementdev/ethers-provider
```

**yarn:**

```bash
yarn add @basementdev/ethers-provider
```

### Getting started

```typescript
const provider = new AlchemyProvider(); // It could be any UrlJsonRpcProvider provider
const enhancedProvider = BasementProvider.enhance(provider);

const logs = await enhancedProvider.getEnhancedLogs(
  {
    fromBlock: 16426225,
    toBlock: 16426226,
  },
  { transaction: { from: true, to: true, events: true } }
);
console.log(logs);
```

### `getEnhancedLogs` can be used as a drop-in replacement for ethers.js' `getLogs`; there are several improvements added:

- Find logs from multiple addresses
- Resolve the related transaction the log was emitted
- Resolve the reverse profile from the sender and receiver of the transaction.
- Resolve the events related to the transaction

The documentation for the options and filters that can be included can be found [here](https://docs.basement.dev/sdk#transactionlogs)
