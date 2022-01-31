import { join } from "path";

export const secretFolderPath = join(__dirname, "..", "secret");
export const privateKeyPath = join(secretFolderPath, "PRIV_KEY.pem");
export const publicKeyPath = join(secretFolderPath, "PUB_KEY.pem");
