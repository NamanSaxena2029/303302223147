const Log = require("./logger");

(async () => {
  await Log(
    "backend",
    "error",
    "handler",
    "received string, expected bool"
  );

  await Log(
    "backend",
    "info",
    "service",
    "user logged in successfully"
  );
})();