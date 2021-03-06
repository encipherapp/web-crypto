/**
 * Copyright (c) Encipher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 */

if (!window.crypto?.subtle) {
  throw new Error(
    'Web Crypto API is not available. Make sure browser support is available and you are running it in secure (HTTPS) context',
  );
}

export {
  default as KeyGenerator,
  KeyGeneratorMaps,
} from './constructors/KeyGenerator';

export { default as Signature } from './constructors/Signature';
export { default as Cipher } from './constructors/Cipher';
export {
  generatePbkdf2FromPassphrase,
  deriveKey,
  wrapKeyWithAesCbc256,
  unwrapKeyWithAesCbc256,
} from './utils';
