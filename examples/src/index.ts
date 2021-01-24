import { unwrapKeyWithAesCbc256 } from '@/services/keyGeneration/keyGeneration';
import {
  wrapKeyWithAesCbc256,
  KeyGenerator,
  KeyGeneratorMaps,
} from '../../src';

const algorithm: RsaHashedKeyGenParams = {
  name: KeyGeneratorMaps.rsaKeyGenerationAlgorithmsMap['RSA-OAEP'],
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: KeyGeneratorMaps.rsaKeyHashFunctionsMap['SHA-256'],
};

const keyGen = new KeyGenerator(algorithm);
let rsaKeyPair: CryptoKeyPair;

(keyGen.generateKey() as Promise<CryptoKeyPair>)
  .then(async (data) => {
    rsaKeyPair = data;
    const wrappedKey = await wrapKeyWithAesCbc256(
      'shirshendu',
      rsaKeyPair.privateKey,
    );
    console.log(wrappedKey);
    const unwrappedKey = await unwrapKeyWithAesCbc256('shirshendu', wrappedKey);

    console.log(rsaKeyPair.privateKey);
    console.log(unwrappedKey);

    const originalKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      rsaKeyPair.privateKey,
    );
    const decryptedKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      unwrappedKey,
    );

    console.log(originalKey);
    console.log(decryptedKey);
  })
  .catch((err) => {
    console.log(err);
  });
