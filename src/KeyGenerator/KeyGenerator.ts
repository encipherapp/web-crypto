const crypto = window.crypto.subtle;

export const RsaKeyGenerationAlgorithmsMap = {
  'RSASSA-PKCS1-v1_5': 'RSASSA-PKCS1-v1_5',
  'RSA-PSS': 'RSA-PSS',
  'RSA-OAEP': 'RSA-OAEP',
};

export const RsaKeyHashFunctionsMap = {
  'SHA-256': 'SHA-256',
  'SHA-384': 'SHA-384',
  'SHA-512': 'SHA-512',
};

export const keyUsagesMap = {
  encrypt: 'encrypt',
  decrypt: 'decrypt',
  sign: 'sign',
  verify: 'verify',
  deriveKey: 'deriveKey',
  deriveBits: 'deriveBits',
  wrapKey: 'wrapKey',
  unwrapKey: 'unwrapKey',
};

class Key {
  algorithmObj: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams;

  extractable: boolean;

  keyUsage: (keyof typeof keyUsagesMap)[];

  constructor(
    algorithmObj: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams,
    extractable = true,
    keyUsage?: (keyof typeof keyUsagesMap)[],
  ) {
    this.algorithmObj = algorithmObj;
    if (
      RsaKeyGenerationAlgorithmsMap[
        algorithmObj.name as keyof typeof RsaKeyGenerationAlgorithmsMap
      ]
    ) {
      this.algorithmObj = {
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        ...algorithmObj,
      };
    }
    this.extractable = extractable;
    this.keyUsage = keyUsage || ['encrypt', 'decrypt', 'sign', 'verify'];
  }

  generateKey(): Promise<CryptoKeyPair | CryptoKey> {
    return crypto.generateKey(
      this.algorithmObj,
      this.extractable,
      this.keyUsage,
    );
  }
}

export default Key;
