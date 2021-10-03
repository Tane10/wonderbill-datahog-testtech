const express = require("express");
const providers = require("./providers.json");
const app = express();
const port = 3000;
const routes = require("./routes");
const redis = require("redis");
/* TODO: we have different options on how to deal with when it goes wrong#
As our data providers can go offline for extended period of time, the naive implementations of this task using retry mechanisms are not going to be accepted!

- Build an API endpoint using Node.js (the likes of Express and Hapi are perfect for this job). You can use TypeScript if you wish;
- The API should accept a POST with two fields provider (gas or internet) and the callbackUrl. The payload should be validated accordingly;
- Once payload is accepted, collect the data from the mock endpoint described previously and call the callbackUrl with the collected data;
- Use Git whilst working on this task - this will help us understanding how you work;
- Use docker-compose to bootstrap other services you may need to complete the task;
- We expect decent test coverage for the code produced.
*/

/** broken down verstion of things that i need to do
 * step 1: set up with docker compose DONE
 * step 2: set up at least one test DONE
 * step 2: build a post endpoint with 2 field provider (gas or internet) + callback
 * step 3: payload for endpoint need to be validated check gas or internet if none the return a default
 * step 4: once payload is accepted then call mock get endpoint "/providers/:id"
 */

const FAILURE_PROBABILITY = 0.5;

const PORT = process.env.PORT || 3000;
// const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const redisClient = redis.createClient(REDIS_PORT);

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
// app.use(heathCheck); can't use health check like midddle ware case it just sits there

app.get("/providers/:id", (req, res) => {
  const bills = providers[req.params.id];
  if (!bills) return res.status(404).end();
  res.send(bills);
});

app.listen(PORT, () =>
  console.log(`Providers server listening at http://localhost:${PORT}`)
);
