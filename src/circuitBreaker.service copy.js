"use strict";
const circuitBreaker = require("opossum");
const axios = require("axios");
const helperFn = require("./helperFunctions");
const logger = require("./logger");

const BASEURL = "http://localhost:3000";

// * Build an API endpoint using Node.js (the likes of Express and Hapi are perfect for this job). You can use TypeScript if you wish;
// * The API should accept a POST with two fields `provider` (`gas` or `internet`) and the `callbackUrl`. The payload should be validated accordingly;
// * Once payload is accepted, collect the data from the mock endpoint described previously and call the `callbackUrl` with the collected data;
// * Use Git whilst working on this task - this will help us understanding how you work;
// * Use docker-compose to bootstrap other services you may need to complete the task;
// * We expect decent test coverage for the code produced.

// ## Bonus points ##
// * Implemented API endpoint in a self-documented way;
// * Consider accepting a payload with multiple providers to collect data from, aggregate from all providers before sending back to the `callbackUrl`;
// * Consider `callbackUrl` also being a point of failure.

// ## Submission ##

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

async function handCallbackFault(providerData) {
  const providersCallback = await axios.post(`${BASEURL}/callbackurl`, {
    providerData: providerData,
  });
}

function handleCallback(req, res, next) {
  res.json(req.body);
}

// this the function that could fail
async function getProviders(req, res, next) {
  const breaker = new circuitBreaker(
    axios.get,
    helperFn.CreateCircuitBreakerOptions(1000, 30, 2000)
  );

  const { provider, callbackUrl } = req.body;

  try {
    breaker.fallback(() => res.send("Sorry, out of service right now"));
    breaker.on("success", () => console.log("success"));
    breaker.on("failure", () => console.log("failed"));
    breaker.on("timeout", () => console.log("timed out"));
    breaker.on("reject", () => console.log("rejected"));
    breaker.on("open", () => console.log("opened"));
    breaker.on("halfOpen", () => console.log("halfOpened"));
    breaker.on("close", () => console.log("closed"));
    const providers = await breaker.fire(`${BASEURL}/providers/${provider}`);
    await handCallbackFault(providers);

    res.status(200);
    res.end();
  } catch (error) {
    logger.error(error);
  }
}

module.exports = getProviders;
