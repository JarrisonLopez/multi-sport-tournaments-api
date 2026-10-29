import "dotenv/config";
import { createApp } from "./app";

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

const port = readPort(process.env.PORT);
const app = createApp();

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
