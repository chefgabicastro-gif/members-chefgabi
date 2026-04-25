import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const app = express();
const PORT = process.env.WEB_PORT || 3000;
const APP_HOSTS = new Set(["app.escoladeproposito.online"]);

app.use(express.static(publicDir));

app.get("/", (req, res, next) => {
  const host = String(req.headers.host || "")
    .replace(/:\d+$/, "")
    .toLowerCase();

  if (APP_HOSTS.has(host)) {
    return res.sendFile(path.join(publicDir, "dashboard.html"));
  }

  return next();
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Members Web running on port ${PORT}`);
});
