const crypto = window.crypto.subtle;

type AlgorithmObj = RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams;

class Cipher {
  algorithmObj: AlgorithmObj;

  defaultEncryptionKey: CryptoKey | undefined;

  defaultDecryptionKey: CryptoKey | undefined;

  constructor(
    algorithmObj: AlgorithmObj,
    defaultEncryptionKey?: CryptoKey,
    defaultDecryptionKey?: CryptoKey,
  ) {
    this.algorithmObj = algorithmObj;
    this.defaultEncryptionKey = defaultEncryptionKey;
    this.defaultDecryptionKey = defaultDecryptionKey;
  }

  encrypt(data: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    if (this.defaultEncryptionKey === undefined && key === undefined) {
      return Promise.reject(
        new Error('Default key and local key both are undefined'),
      );
    }
    return crypto.encrypt(
      this.algorithmObj,
      (key || this.defaultEncryptionKey) as CryptoKey,
      data,
    );
  }

  decrypt(chipherText: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    return crypto.encrypt(
      this.algorithmObj,
      (key || this.defaultDecryptionKey) as CryptoKey,
      chipherText,
    );
  }
}

export default Cipher;
