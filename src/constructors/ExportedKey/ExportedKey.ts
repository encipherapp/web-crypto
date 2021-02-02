/**
 * Copyright (c) Encipher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 */

export interface NonWrappedInfo {
  isWrapped: false;
}

export interface WrappedInfo {
  isWrapped: true;
  algorithm:
    | RsaOaepParams
    | AesCtrParams
    | AesCbcParams
    | AesGcmParams
    | 'AES-KW'
    | { name: 'AES-KW' };
  format: 'raw' | 'pkcs8' | 'spki' | 'jwk';
}

/**
 * A class containing an exported key (Array buffer) and it's corresponding method
 */
class ExportedKey {
  key: ArrayBuffer;

  algorithm: CryptoKey['algorithm'];

  type: KeyType;

  usages: KeyUsage[];

  wrappingInfo: NonWrappedInfo | WrappedInfo;

  /**
   * Create a new exported key object
   * @param key The key
   * @param algorithm The algorithm object of the key
   * @param type The key type
   * @param usages Key usage
   * @param wrappingInfo Object describing how the key was wrapped
   */
  constructor(
    key: ArrayBuffer | string,
    algorithm: CryptoKey['algorithm'],
    type: KeyType,
    usages: KeyUsage[],
    wrappingInfo: NonWrappedInfo | WrappedInfo,
  ) {
    this.key = typeof key === 'string' ? ExportedKey.toByteArray(key) : key;
    this.algorithm = algorithm;
    this.type = type;
    this.usages = usages;
    this.wrappingInfo = wrappingInfo;
  }

  /**
   * From hex string convert to array buffer
   * @param hexString The hex string which needs to be converted
   */
  static toByteArray(hexString: string): ArrayBuffer {
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return byteArray.buffer;
  }

  /**
   * Convert from array buffer to hex string
   */
  toHexString(): string {
    const byteArray = new Uint8Array(this.key);
    return Array.prototype.map
      .call(byteArray, (byte) => {
        // eslint-disable-next-line prefer-template, no-bitwise
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
      })
      .join('');
  }
}

export default ExportedKey;
