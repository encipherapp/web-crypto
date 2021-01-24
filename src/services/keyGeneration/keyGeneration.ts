import Key from '@/constructors/Key';

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

/**
 * Generate a PBKDF2 key from passphrase to use in key derivation
 * @param passphrase The passphrase string
 */
export function generatePbkdf2FromPassphrase(
  passphrase: string,
): Promise<CryptoKey> {
  return Key.import('raw', encoder.encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ]);
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
  const pbkdf2Key = await generatePbkdf2FromPassphrase(passphrase);
  const derivedAesCbc256Key = await deriveKey(pbkdf2Key);

  const wrappedKey = await cryptoSubtle.wrapKey(
    'raw',
    keyToBeWrapped,
    derivedAesCbc256Key,
    defaultAesCbc256Algorithm,
  );

  return wrappedKey;
}
