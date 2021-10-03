"use strict";
const axios = require("axios");
const helperFn = require("./helperFunctions");
const logger = require("./logger");
const { validPayload } = require("./jsonSchema");
const CircuitBreaker = require("opossum");

const BASEURL = "http://localhost:3000";

async function providerCircuitBreaker(providers, callbackUrl) {
  let providerData = {};

  for (let provider of providers) {
    const request = await axios.get(`${BASEURL}/providers/${provider}`);
    providerData[provider] = request.data;
  }

  return providerData;
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(providerCircuitBreaker, options);

async function getProviders(req, res, next) {
  const payloadValidation = validPayload(req.body);
  breaker.fallback(() => res.send("Sorry, out of service right now"));
  breaker.on("success", () => console.log("success"));
  breaker.on("failure", () => console.log("failed"));
  breaker.on("timeout", () => console.log("timed out"));
  breaker.on("reject", () => console.log("rejected"));
  breaker.on("open", () => console.log("opened"));
  breaker.on("halfOpen", () => console.log("halfOpened"));
  breaker.on("close", () => console.log("closed"));

  if (payloadValidation.valid) {
    const { providers, callbackUrl } = req.body;

    try {
      const providersData = await breaker.fire(providers, callbackUrl);
      res.json(providersData);
    } catch (error) {
      const { failures, fallbacks, rejects, timeouts } = breaker.stats;
      console.log(
        `failures: ${failures}, fallbacks: ${fallbacks}, rejects: ${rejects}, timeouts: ${timeouts}`
      );
    }
  } else {
    res.status(400);
    res.json({ message: "Invalid request" });
  }
}

module.exports = { getProviders };
