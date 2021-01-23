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

  encrypt(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    return crypto.encrypt(
      this.algorithmObj,
      this.defaultEncryptionKey || key,
      data,
    );
  }

  decrypt(key: CryptoKey, chipherText: ArrayBuffer): Promise<ArrayBuffer> {
    return crypto.encrypt(
      this.algorithmObj,
      this.defaultDecryptionKey || key,
      chipherText,
    );
  }
}

export default Cipher;
