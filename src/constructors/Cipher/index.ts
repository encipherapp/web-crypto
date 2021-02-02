const crypto = window.crypto.subtle;

type AlgorithmObj = RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams;

/**
 * A class containing methods and objects for encryption & decryption
 */
class Cipher {
  algorithmObj: AlgorithmObj;

  defaultEncryptionKey: CryptoKey | undefined;

  defaultDecryptionKey: CryptoKey | undefined;

  static invalidKeyError = new Error(
    'Default key and local key both are undefined',
  );

  /**
   * Create a new Cipher object
   * @param algorithmObj Algorithm to be used for the encryption & decryption process
   * @param defaultEncryptionKey Default key for encryption, if omitted then key needs to be passed to encrypt method
   * @param defaultDecryptionKey Default key for decryption, if omitted then key needs to be passed to decrypt method
   */
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

  /**
   * Encrypt an array buffer (binary data), rejects with error if nither a key is not provided nor a default key is not available
   * @param data Data which will be encrypted
   * @param key Key to be used for encryption, can be omitted if defaultEncryptionKey is set
   */
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

  /**
   * Decrypts an encrypted array buffer, rejects with error if nither a key is not provided nor a default key is not available
   * @param chipherText The ecnrypted data
   * @param key Key to be used for decryption, can be omitted if defaultDecryptionKey is set
   */
  decrypt(chipherText: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    if (!Cipher.isValidKeyAvailable(this.defaultDecryptionKey, key)) {
      return Promise.reject(Cipher.invalidKeyError);
    }

    return crypto.decrypt(
      this.algorithmObj,
      (key || this.defaultDecryptionKey) as CryptoKey,
      chipherText,
    );
  }
}

export default Cipher;
