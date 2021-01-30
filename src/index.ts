import KeyGenerator, {
  rsaKeyGenerationAlgorithmsMap,
  rsaKeyHashFunctionsMap,
  keyUsagesMap,
} from './constructors/KeyGenerator';
import Signature from './constructors/Signature';
import Cipher from './constructors/Cipher';

import {
  generatePbkdf2FromPassphrase,
  deriveKey,
  wrapKeyWithAesCbc256,
} from './utils';

const KeyGeneratorMaps = {
  rsaKeyGenerationAlgorithmsMap,
  rsaKeyHashFunctionsMap,
  keyUsagesMap,
};

export {
  KeyGenerator,
  KeyGeneratorMaps,
  Signature,
  Cipher,
  generatePbkdf2FromPassphrase,
  deriveKey,
  wrapKeyWithAesCbc256,
};
