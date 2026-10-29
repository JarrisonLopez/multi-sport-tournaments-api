import "dotenv/config";
import { createApp } from "./app";
import { assertCorsConfiguration } from "./interface/http/cors";

function readPort(value: string | undefined): number {
  if (value === undefined || value.trim() === "") {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT debe ser un entero entre 1 y 65535.");
  }

  return port;
}

assertCorsConfiguration();

const host = "0.0.0.0";
const port = readPort(process.env.PORT);
const app = createApp();

app.listen(port, host, () => {
  console.log(`API escuchando en ${host}:${port}`);
});
