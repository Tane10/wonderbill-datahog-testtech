"use strict";
const circuitBreaker = require("opossum");
const axios = require("axios");
const helperFn = require("./helperFunctions");
const logger = require("./logger");
const { validPayload } = require("./jsonSchema");

const BASEURL = "http://localhost:3000";

// * Once payload is accepted, collect the data from the mock endpoint described previously and call the `callbackUrl` with the collected data;

// ## Bonus points ##
// * Implemented API endpoint in a self-documented way;
// * Consider `callbackUrl` also being a point of failure.

// ## Submission ##

// if fail then call cache and return data rather than failing
// breaker fallback will be the cache data

async function getProviders(req, res, next) {
  const payloadValidation = validPayload(req.body);

  if (payloadValidation.valid) {
    const { providers, callbackUrl } = req.body;

    let providerData = {};

    for (let provider of providers) {
      const request = await axios.get(`${BASEURL}/providers/${provider}`);
      providerData[provider] = request.data;
    }
    res.json(providerData);
  } else {
    res.status(400);
    res.json({ message: "Invalid request" });
  }
}

module.exports = { getProviders };
