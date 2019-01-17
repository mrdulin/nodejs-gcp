import dotenv from "dotenv";
import path from "path";

import { ICredentials } from "./types";
import { logger } from "../../utils";

const dotenvOptions = { path: path.resolve(__dirname, ".env") };
const dotenvConfigOutput = dotenv.config(dotenvOptions);

if (dotenvConfigOutput.error) {
  logger.error(dotenvConfigOutput.error);
}

const credentials: ICredentials = {
  CLIENT_ID: process.env.CLIENT_ID || "",
  CLIENT_SECRET: process.env.CLIENT_SECRET || "",
  REDIRECT_URL: process.env.REDIRECT_URL || ""
};

logger.info(credentials);

export { credentials };
