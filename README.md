# Web Crypto

![npm (scoped)](https://img.shields.io/npm/v/@encipher/web-crypto)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@encipher/web-crypto)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@encipher/web-crypto)

![NPM](https://img.shields.io/npm/l/@encipher/web-crypto)

### A promised based easy to use wrapper and services built using Web Crypto APIs

```diff
-! NOTE: This is a WIP library.
-! APIs may change drastically till we release a stable version.
-! Please watch this repo for updates.
```

The objective of this library is to provide some wrapper methods and services which are very easy to use to perform cryptographic operations in the browser.

This library internally uses Web Crypto browser APIs, so this library can't run on any browser which does't support Web Crypto APIs. Also note that Web Crypto APIs are only available in secure context (HTTPS) even in modern browsers.

For more information on Web Crypto API browser support, click [here](https://caniuse.com/cryptography)

For reporting any kind of issues please use the [issues](/../../issues) tracker. For general discussion, feature request use the [discussions](/../../discussions).

## Installations

```bash
npm install @encipher/web-crypto --save
```

## Examples:

### Key Generations

```JavaScript
import {
  KeyGenerator,
  KeyGeneratorMaps,
} from '@encipher/web-crypto';


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

### Encrypting a key with a passphrase

It's often required that you need to export a private key, like for server side storage. Before that you want to encrypt the key with a passphrase.
This library provides some utils functions to do that easily.

Wrap (encrypt) a key with a `AES-CBC-256` key derived using `PBKDF2` and a passphrase

```JavaScript
import {
  wrapKeyWithAesCbc256,
} from '@encipher/web-crypto';


const passphrase = "This is really a secret";

let wrappedKey;

wrapKeyWithAesCbc256(
  passphrase,
  rsaKeyPair.privateKey,
).then((data) => {
  wrappedKey = data;
});
```

### Encrypting & Decrypting a payload (With RSA key pair)

```JavaScript
const encryptionAlgorith = {
    name: 'RSA-OAEP',
  };

// rsaKeyPair generated with KeyGenerator as shown above
const cipher = new Cipher(
  encryptionAlgorith,
  rsaKeyPair.publicKey,
  rsaKeyPair.privateKey,
);

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const cipherText = await cipher.encrypt(encoder.encode('Hello World'));
let plainText = await cipher.decrypt(cipherText);
plainText = decoder.decode(plainText)
```

Many more comming soon...
