import { config } from "dotenv";
config();

import { buildServer } from "./server";

const port = Number(process.env.PORT || 3000);

buildServer()
  .then((app) => app.listen({ port, host: "0.0.0.0" }))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
