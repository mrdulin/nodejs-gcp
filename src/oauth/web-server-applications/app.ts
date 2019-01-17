import express from "express";
import http from "http";
import request from "request-promise";

import { logger } from "../../utils";
import { IApplicationOptions, ICredentials } from "./types";

async function bootstrap(
  options: IApplicationOptions & ICredentials
): Promise<http.Server> {
  const app: express.Application = express();
  const { PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = options;

  app.get("/", (req, res) => {
    res.end("normal");
  });

  app.get("/oauth/callback", async (req, res) => {
    console.log(req.query);
    const { code, access_token, refresh_token } = req.query;

    if (code) {
      const tokenRequestOption = {
        method: "POST",
        uri: "https://www.googleapis.com/oauth2/v4/token",
        body: {
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URL,
          grant_type: "authorization_code"
        },
        json: true
      };
      logger.info(tokenRequestOption);
      try {
        const tokenResponse = await request(tokenRequestOption);
        logger.info(tokenResponse);
        logger.info("Store access_token and refresh_token into database");
        res.redirect("/");
      } catch (error) {
        logger.error(error);
        res.sendStatus(401);
      }
    } else {
      // TODO
    }
  });

  return app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
  });
}

export { bootstrap };
