const crypto = window.crypto.subtle;

type AlgorithmObj =
  | {
      name: string;
    }
  | RsaPssParams
  | EcdsaParams;

class Signature {
  algorithmObj: AlgorithmObj;

  defaultKey: CryptoKey | undefined;

  static invalidKeyError = new Error(
    'Default key and local key both are undefined',
  );

  constructor(algorithmObj: AlgorithmObj, defaultKey?: CryptoKey) {
    this.algorithmObj = algorithmObj;
    this.defaultKey = defaultKey;
  }

  isValidKeyAvailable(key?: CryptoKey): boolean {
    if (this.defaultKey === undefined && key === undefined) {
      return false;
    }

    return true;
  }

  sign(data: ArrayBuffer, key?: CryptoKey): Promise<ArrayBuffer> {
    if (!this.isValidKeyAvailable(key)) {
      return Promise.reject(Signature.invalidKeyError);
    }
    return crypto.sign(
      this.algorithmObj,
      (key || this.defaultKey) as CryptoKey,
      data,
    );
  }

  verify(
    signature: ArrayBuffer,
    data: ArrayBuffer,
    key?: CryptoKey,
  ): Promise<boolean> {
    if (!this.isValidKeyAvailable()) {
      return Promise.reject(Signature.invalidKeyError);
    }

    return crypto.verify(
      this.algorithmObj,
      (this.defaultKey || key) as CryptoKey,
      signature,
      data,
    );
  }
}

export default Signature;
