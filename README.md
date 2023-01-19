# Basement ethers.js

A drop-in replacement for ethers.js

### Getting started

```typescript
const provider = new AlchemyProvider(); // It could be any UrlJsonRpcProvider provider
const enhancedProvider = BasementProvider.enhance(provider);

// Here you can use the provider as usual
// ...
```