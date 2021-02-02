/**
 * Copyright (c) Encipher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 */

import { DefaultKeyUsage } from '../../constants';

const crypto = window.crypto.subtle;

const rsaKeyGenerationAlgorithmsMap = {
  'RSASSA-PKCS1-v1_5': 'RSASSA-PKCS1-v1_5',
  'RSA-PSS': 'RSA-PSS',
  'RSA-OAEP': 'RSA-OAEP',
};

const rsaKeyHashFunctionsMap = {
  'SHA-256': 'SHA-256',
  'SHA-384': 'SHA-384',
  'SHA-512': 'SHA-512',
};

const keyUsagesMap: { [key: string]: KeyUsage } = {
  encrypt: 'encrypt',
  decrypt: 'decrypt',
  sign: 'sign',
  verify: 'verify',
  deriveKey: 'deriveKey',
  deriveBits: 'deriveBits',
  wrapKey: 'wrapKey',
  unwrapKey: 'unwrapKey',
};

/**
 * A class for creating a key generator object
 */
class KeyGenerator {
  algorithmObj: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams;

  extractable: boolean;

  keyUsage: KeyUsage[];

  /**
   * Create a new key generator object
   * @param algorithmObj The algorithm object to be used for the key generation
   * @param extractable Set to true of you need to export the key
   * @param keyUsage Array of key usage option
   */
  constructor(
    algorithmObj: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams,
    extractable = true,
    keyUsage?: KeyUsage[],
  ) {
    this.algorithmObj = algorithmObj;
    if (
      rsaKeyGenerationAlgorithmsMap[
        algorithmObj.name as keyof typeof rsaKeyGenerationAlgorithmsMap
      ]
    ) {
      this.algorithmObj = {
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        ...algorithmObj,
      };
    }
    this.extractable = extractable;
    this.keyUsage = keyUsage || DefaultKeyUsage;
  }

  /**
   * Generate a new key
   */
  generateKey(): Promise<CryptoKeyPair | CryptoKey> {
    return crypto.generateKey(
      this.algorithmObj,
      this.extractable,
      this.keyUsage,
    );
  }
}

export default KeyGenerator;

export const KeyGeneratorMaps = {
  rsaKeyGenerationAlgorithmsMap,
  rsaKeyHashFunctionsMap,
  keyUsagesMap,
};
