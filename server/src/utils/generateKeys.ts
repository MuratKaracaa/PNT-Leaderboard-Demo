import { generateKeyPairSync } from "crypto";
import { writeFileSync, mkdirSync } from "fs";

import { pathConstants } from "../constants";

// This script is not used anywhere in the actual code. This is just to generate public and private keys to be used in token issuing and verifying.

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});
mkdirSync(pathConstants.secretFolderPath);
writeFileSync(pathConstants.privateKeyPath, privateKey);
writeFileSync(pathConstants.publicKeyPath, publicKey);
