# Web Crypto

### A promised based easy to use wrapper and services built using Web Crypto APIs

**NOTE: This is a WIP library, APIs may change drastically till we release a stable version.**

The objective of this library is to provide some wrapper methods and services which are very easy to use to perform cryptographic operations in the browser.

This library internally uses Web Crypto browser APIs, so this library can't run on any browser which does't support Web Crypto APIs. Also note that Web Crypto APIs are only available in secure context (HTTPS) even in modern browsers.

For more information on Web Crypto API browser support, click [here](https://caniuse.com/cryptography)

## Examples:

### Key Generations

```JavaScript
// Generating a RSA key pair
const keyAlgorithm = {
  name: KeyGeneratorMaps.rsaKeyGenerationAlgorithmsMap['RSA-OAEP'],
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: KeyGeneratorMaps.rsaKeyHashFunctionsMap['SHA-256'],
};

const keyGen = new KeyGenerator(algorithm);

// Generate as many keys as you want with the keyGen object
let rsaKeyPair1;
let rsaKeyPair2;

keyGen.generateKey().then(data => {
  rsaKeyPair1 = data;
})

keyGen.generateKey().then(data => {
  rsaKeyPair2 = data;
})
```
