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

class ExportedKey {
  key: ArrayBuffer;

  algorithm: CryptoKey['algorithm'];

  type: KeyType;

  usages: KeyUsage[];

  wrappingInfo: NonWrappedInfo | WrappedInfo;

  constructor(
    key: ArrayBuffer,
    algorithm: CryptoKey['algorithm'],
    type: KeyType,
    usages: KeyUsage[],
    wrappingInfo: NonWrappedInfo | WrappedInfo,
  ) {
    this.key = key;
    this.algorithm = algorithm;
    this.type = type;
    this.usages = usages;
    this.wrappingInfo = wrappingInfo;
  }

  // static toByteArray(hexString) {}

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
