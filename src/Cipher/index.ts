const crypto = window.crypto.subtle;

type AlgorithmObj = RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams;

class Cipher {
  algorithmObj: AlgorithmObj;

  defaultEncryptionKey: CryptoKey | undefined;

  defaultDecryptionKey: CryptoKey | undefined;

  static invalidKeyError = new Error(
    'Default key and local key both are undefined',
  );

  constructor(
    algorithmObj: AlgorithmObj,
    defaultEncryptionKey?: CryptoKey,
    defaultDecryptionKey?: CryptoKey,
  ) {
    this.algorithmObj = algorithmObj;
    this.defaultEncryptionKey = defaultEncryptionKey;
    this.defaultDecryptionKey = defaultDecryptionKey;
  }

  static isValidKeyAvailable(defaultKey?: CryptoKey, key?: CryptoKey): boolean {
    if (defaultKey === undefined && key === undefined) {
      return false;
    }

    return true;
  }

  encrypt(data: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    if (!Cipher.isValidKeyAvailable(this.defaultEncryptionKey, key)) {
      return Promise.reject(Cipher.invalidKeyError);
    }
    return crypto.encrypt(
      this.algorithmObj,
      (key || this.defaultEncryptionKey) as CryptoKey,
      data,
    );
  }

  decrypt(chipherText: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    if (!Cipher.isValidKeyAvailable(this.defaultDecryptionKey, key)) {
      return Promise.reject(Cipher.invalidKeyError);
    }

    return crypto.encrypt(
      this.algorithmObj,
      (key || this.defaultDecryptionKey) as CryptoKey,
      chipherText,
    );
  }
}

export default Cipher;
