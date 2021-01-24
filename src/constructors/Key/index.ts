import { DefaultKeyUsage } from '@/constants';

export type ExportableKeyFormat = 'raw' | 'pkcs8' | 'spki' | 'jwk';

const crypto = window.crypto.subtle;

class Key {
  key: CryptoKey;

  constructor(key: CryptoKey) {
    this.key = key;
  }

  static import(
    format: ExportableKeyFormat,
    keyData: ArrayBuffer,
    algorithm:
      | string
      | Algorithm
      | RsaHashedImportParams
      | EcKeyImportParams
      | HmacImportParams
      | DhImportKeyParams
      | AesKeyAlgorithm,
    extractable: boolean,
    keyUsage?: KeyUsage[],
  ): Promise<CryptoKey> {
    return crypto.importKey(
      format,
      keyData,
      algorithm,
      extractable,
      keyUsage || DefaultKeyUsage,
    );
  }

  export(format: ExportableKeyFormat): Promise<ArrayBuffer | JsonWebKey> {
    return crypto.exportKey(format, this.key);
  }

  wrap(
    format: ExportableKeyFormat,
    wrappingKey: CryptoKey,
    algorithm:
      | string
      | Algorithm
      | RsaOaepParams
      | AesCtrParams
      | AesCbcParams
      | AesCmacParams
      | AesGcmParams
      | AesCfbParams,
  ): Promise<ArrayBuffer> {
    return crypto.wrapKey(format, this.key, wrappingKey, algorithm);
  }

  unwrap(
    format: ExportableKeyFormat,
    wrappedKey: ArrayBuffer,
    algorithm:
      | AlgorithmIdentifier
      | RsaOaepParams
      | AesCtrParams
      | AesCbcParams
      | AesCmacParams
      | AesGcmParams
      | AesCfbParams,
    unwrappingKeyAlgorithm:
      | AlgorithmIdentifier
      | RsaHashedImportParams
      | EcKeyImportParams
      | HmacImportParams
      | DhImportKeyParams
      | AesKeyAlgorithm,
    extractable: boolean,
    keyUsage?: KeyUsage[],
  ): Promise<CryptoKey> {
    return crypto.unwrapKey(
      format,
      wrappedKey,
      this.key,
      algorithm,
      unwrappingKeyAlgorithm,
      extractable,
      keyUsage || DefaultKeyUsage,
    );
  }
}

export default Key;
