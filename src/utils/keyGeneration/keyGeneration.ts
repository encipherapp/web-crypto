/**
 * Copyright (c) Encipher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 */

import ExportedKey from '../../constructors/ExportedKey/ExportedKey';

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

const algorithmToFormatMap: { [key: string]: 'raw' } = {
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

/**
 * Wrap a crypto key with AES-CBC-256, key derived from PBKDF2 passphrase
 * @param passphrase Passphrase which will be used to derive key
 * @param keyToBeWrapped The crypto key object to be wrapped
 */
export async function wrapKeyWithAesCbc256(
  passphrase: string,
  keyToBeWrapped: CryptoKey,
): Promise<ExportedKey> {
  const wrappingAlgorithm: AesCbcParams = {
    name: 'AES-CBC',
    iv: new Uint8Array(16),
  };
  const wrappedKeyFormat: 'raw' | 'pkcs8' = algorithmToFormatMap[
    keyToBeWrapped.algorithm.name
  ]
    ? algorithmToFormatMap[keyToBeWrapped.algorithm.name]
    : 'pkcs8';

  try {
    const pbkdf2Key = await generatePbkdf2FromPassphrase(passphrase);
    const derivedAesCbc256Key = await deriveKey(pbkdf2Key);
    const wrappedKey = await cryptoSubtle.wrapKey(
      wrappedKeyFormat,
      keyToBeWrapped,
      derivedAesCbc256Key,
      wrappingAlgorithm,
    );
    const key = new ExportedKey(
      wrappedKey,
      keyToBeWrapped.algorithm,
      keyToBeWrapped.type,
      keyToBeWrapped.usages,
      {
        isWrapped: true,
        algorithm: wrappingAlgorithm,
        format: wrappedKeyFormat,
      },
    );
    return key;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Unwrap a key which was wrapped using AES-CBC-256
 * @param passphrase Passphrase which will be used to derive key for unwrapping
 * @param wrappedKey The ExportedKey object which needs to be unwrapped
 */
export async function unwrapKeyWithAesCbc256(
  passphrase: string,
  wrappedKey: ExportedKey,
): Promise<CryptoKey> {
  if (!wrappedKey.wrappingInfo.isWrapped) {
    return Promise.reject(new Error('Given key object is not wrapped'));
  }
  try {
    const pbkdf2Key = await generatePbkdf2FromPassphrase(passphrase);
    const derivedAesCbc256Key = await deriveKey(pbkdf2Key);
    const unwrappedKey = await cryptoSubtle.unwrapKey(
      wrappedKey.wrappingInfo.format,
      wrappedKey.key,
      derivedAesCbc256Key,
      wrappedKey.wrappingInfo.algorithm,
      wrappedKey.algorithm,
      true,
      wrappedKey.usages,
    );
    return unwrappedKey;
  } catch (err) {
    return Promise.reject(err);
  }
}
