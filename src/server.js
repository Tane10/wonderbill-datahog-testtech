"use strict";
const express = require("express");
const app = express();
const providers = require("./providers.json");
const routes = require("./routes");

const FAILURE_PROBABILITY = 0.5;
const PORT = process.env.PORT || 3000;

function randomFailuresMiddleware(_, res, next) {
  if (Math.random() > 1 - FAILURE_PROBABILITY) {
    res.setHeader("Content-Type", "text/plain");
    res.writeHead(500, res.headers);
    return res.end("#fail");
  }
  next();
}

// app.use(randomFailuresMiddleware);
app.use(express.json());
app.use(routes);

app.get("/providers/:id", (req, res) => {
  const bills = providers[req.params.id];
  if (!bills) return res.status(404).end();
  res.send(bills);
});

app.listen(PORT, () =>
  console.log(`Providers server listening at http://localhost:${PORT}`)
);
