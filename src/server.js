const express = require("express");
const providers = require("./providers.json");
const app = express();
const port = 3000;
const heathCheck = require("./healthCheck");
/* TODO: we have different options on how to deal with when it goes wrong#
- timeouts
- retries
- circut brake * this is a good thing 
- internal cache memory * this is another good way
try to add a circuit breaker
*/

const FAILURE_PROBABILITY = 0.5;

function randomFailuresMiddleware(_, res, next) {
  if (Math.random() > 1 - FAILURE_PROBABILITY) {
    res.setHeader("Content-Type", "text/plain");
    res.writeHead(500, res.headers);
    return res.end("#fail");
  }
  next();
}

app.use(randomFailuresMiddleware);
// app.use(heathCheck); can't use health check like midddle ware case it just sits there

app.get("/providers/:id", (req, res) => {
  const bills = providers[req.params.id];
  if (!bills) return res.status(404).end();
  res.send(bills);
});

app.get("/healthcheck", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () =>
  console.log(`Providers server listening at http://localhost:${port}`)
);
