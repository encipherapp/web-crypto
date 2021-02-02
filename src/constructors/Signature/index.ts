/**
 * Copyright (c) Encipher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line import/prefer-default-export
export const DefaultKeyUsage: KeyUsage[] = ['encrypt', 'decrypt'];

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
