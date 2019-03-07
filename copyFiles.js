const env = process.env.NODE_ENV || "development";
const isProd = env === "production";

var shell = require("shelljs");

shell.cp("package.json", "dist/package.json");
shell.cp("-R", "config/", "dist/");
shell.cp("-R", "public/", "dist/");
shell.cp(
  isProd ? "env/processes.prod.json" : "env/processes.dev.json",
  "dist/processes.json",
);
