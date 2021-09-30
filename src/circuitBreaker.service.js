"use strict";
const circuitBreaker = require("opossum");
const axios = require("axios");
const helperFn = require("./helperFunctions");
const logger = require("./logger");

const BASEURL = "http://localhost:3000";

// create a servicer to handle the providers
// this service will need to use a circuit breaker and the helper funton toi create the options
// * step 2: build a post endpoint with 2 field provider (gas or internet) + callback
// * step 3: payload for endpoint need to be validated check gas or internet if none the return a default
// * step 4: once payload is accepted then call mock get endpoint "/providers/:id"
// /handle-provider
// /healthcheck
// /callbackurl
// /providers/:id

// if fail then call cache and return data rather than failing
// breaker fallback will be the cache data

// this the function that could fail
async function getProviders(req, res, next) {
  const breaker = new circuitBreaker(
    axios.get,
    helperFn.CreateCircuitBreakerOptions(1000, 30, 2000)
  );

  try {
    breaker.fallback(() => res.send("Sorry, out of service right now"));
    breaker.on("success", () => console.log("success"));
    breaker.on("failure", () => console.log("failed"));
    breaker.on("timeout", () => console.log("timed out"));
    breaker.on("reject", () => console.log("rejected"));
    breaker.on("open", () => console.log("opened"));
    breaker.on("halfOpen", () => console.log("halfOpened"));
    breaker.on("close", () => console.log("closed"));
    const providers = await breaker.fire(`${BASEURL}/providers/gas`);

    res.send(providers.data);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = getProviders;

docker run -d --name  redisLocal -p 127.0.0.1:6379:6379 redis