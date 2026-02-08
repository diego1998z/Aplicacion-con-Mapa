const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || "5173";
const isWin = process.platform === "win32";
const bin = isWin ? "serve.cmd" : "serve";
const servePath = path.join(__dirname, "..", "node_modules", ".bin", bin);

const spawnArgs = ["-s", ".", "-l", port];
const child = isWin
  ? spawn("cmd.exe", ["/c", servePath, ...spawnArgs], { stdio: "inherit" })
  : spawn(servePath, spawnArgs, { stdio: "inherit" });

child.on("exit", (code) => {
  process.exit(typeof code === "number" ? code : 0);
});

child.on("error", (err) => {
  console.error("No se pudo iniciar el servidor:", err && err.message ? err.message : err);
  process.exit(1);
});
