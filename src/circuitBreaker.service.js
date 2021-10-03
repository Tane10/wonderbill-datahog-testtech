"use strict";
const axios = require("axios");
const CircuitBreaker = require("opossum");
const { getAsync, setAsync } = require("./redisClient");

const BASEURL = "http://localhost:3000";

async function providerCircuitBreaker(providers, callbackUrl) {
  let providerData = {};

  const cache = await getAsync("providers");

  if (cache) {
    console.log("from the cache");
    return JSON.parse(cache);
  } else {
    for (let provider of providers) {
      const request = await axios.get(`${BASEURL}/providers/${provider}`);
      providerData[provider] = request.data;
    }

    // cache providers
    await setAsync("providers", JSON.stringify(providerData), "EX", 3600);

    return providerData;
  }
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

let breaker = new CircuitBreaker(providerCircuitBreaker, options);

breaker.on("success", () => console.log("success"));
breaker.on("failure", () => console.log("failed"));
breaker.on("timeout", () => console.log("timed out"));
breaker.on("reject", () => console.log("rejected"));
breaker.on("open", () => console.log("opened"));
breaker.on("halfOpen", () => console.log("halfOpened"));
breaker.on("close", () => console.log("closed"));

module.exports = { breaker, BASEURL };
