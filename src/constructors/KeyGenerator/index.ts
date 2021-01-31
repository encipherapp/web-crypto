import { DefaultKeyUsage } from '@/constants';

const crypto = window.crypto.subtle;

export const rsaKeyGenerationAlgorithmsMap = {
  'RSASSA-PKCS1-v1_5': 'RSASSA-PKCS1-v1_5',
  'RSA-PSS': 'RSA-PSS',
  'RSA-OAEP': 'RSA-OAEP',
};

export const rsaKeyHashFunctionsMap = {
  'SHA-256': 'SHA-256',
  'SHA-384': 'SHA-384',
  'SHA-512': 'SHA-512',
};

export const keyUsagesMap: { [key: string]: KeyUsage } = {
  encrypt: 'encrypt',
  decrypt: 'decrypt',
  sign: 'sign',
  verify: 'verify',
  deriveKey: 'deriveKey',
  deriveBits: 'deriveBits',
  wrapKey: 'wrapKey',
  unwrapKey: 'unwrapKey',
};

class KeyGenerator {
  algorithmObj: RsaHashedKeyGenParams | EcKeyGenParams | DhKeyGenParams;

  extractable: boolean;

  keyUsage: KeyUsage[];

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
