import { config } from "dotenv";
config();

import { buildServer } from "./server";
import { initIO } from "./lib/io";

const port = Number(process.env.PORT || 3000);

buildServer()
  .then(async (app) => {
    initIO(app);
    await app.listen({ port, host: "0.0.0.0" });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
