const cryptoSubtle = window.crypto.subtle;

const encoder = new TextEncoder();
const defaultAesCbc256Algorithm: AesKeyGenParams = {
  name: 'AES-CBC',
  length: 256,
};
const defaultKeyDerivationAlgorithm: Pbkdf2Params = {
  name: 'PBKDF2',
  hash: 'SHA-256',
  salt: window.crypto.getRandomValues(new Uint8Array(16)),
  iterations: 250000,
};

const algorithmToFormatMap: { [key: string]: string } = {
  'AES-CBC': 'raw',
  'AES-CTR': 'raw',
  'AES-GCM': 'raw',
  'AES-KW': 'raw',
  HMAC: 'raw',
};

/**
 * Generate a PBKDF2 key from passphrase to use in key derivation
 * @param passphrase The passphrase string
 */
export function generatePbkdf2FromPassphrase(
  passphrase: string,
): Promise<CryptoKey> {
  return cryptoSubtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
}

/**
 * Derive a key using a master key
 * @param algorithm Defaults to PBKDF2 with SHA-256, random salt of 128 bits and 250000 iterations
 * @param baseKey
 * @param derivedKeyAlgorithm
 * @param extractable
 * @param keyUsage
 */
export function deriveKey(
  baseKey: CryptoKey,
  algorithm:
    | EcdhKeyDeriveParams
    | HkdfParams
    | Pbkdf2Params = defaultKeyDerivationAlgorithm,
  derivedKeyAlgorithm:
    | AesKeyGenParams
    | HmacKeyGenParams = defaultAesCbc256Algorithm,
  extractable = true,
  keyUsage: KeyUsage[] = ['decrypt', 'encrypt', 'wrapKey', 'unwrapKey'],
): Promise<CryptoKey> {
  return cryptoSubtle.deriveKey(
    algorithm,
    baseKey,
    derivedKeyAlgorithm,
    extractable,
    keyUsage,
  );
}

export async function wrapKeyWithAesCbc256(
  passphrase: string,
  keyToBeWrapped: CryptoKey,
): Promise<ArrayBuffer> {
  try {
    const pbkdf2Key = await generatePbkdf2FromPassphrase(passphrase);
    const derivedAesCbc256Key = await deriveKey(pbkdf2Key);
    const wrappedKey = await cryptoSubtle.wrapKey(
      algorithmToFormatMap[keyToBeWrapped.algorithm.name]
        ? algorithmToFormatMap[keyToBeWrapped.algorithm.name]
        : 'pkcs8',
      keyToBeWrapped,
      derivedAesCbc256Key,
      {
        name: 'AES-CBC',
        iv: new Uint8Array(16),
      },
    );
    return wrappedKey;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function unwrapKeyWithAesCbc256(
  passphrase: string,
  wrappedKey: ArrayBuffer,
  format = 'pkcs8',
): Promise<CryptoKey> {
  try {
    const pbkdf2Key = await generatePbkdf2FromPassphrase(passphrase);
    const derivedAesCbc256Key = await deriveKey(pbkdf2Key);
    const unwrappedKey = await cryptoSubtle.unwrapKey(
      format,
      wrappedKey,
      derivedAesCbc256Key,
      {
        name: 'AES-CBC',
        iv: new Uint8Array(16),
      },
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt'],
    );
    return unwrappedKey;
  } catch (err) {
    return Promise.reject(err);
  }
}
