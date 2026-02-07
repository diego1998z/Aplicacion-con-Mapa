const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || "5173";
const bin = process.platform === "win32" ? "serve.cmd" : "serve";
const servePath = path.join(__dirname, "..", "node_modules", ".bin", bin);

const child = spawn(servePath, ["-s", ".", "-l", port], {
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(typeof code === "number" ? code : 0);
});
