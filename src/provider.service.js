"use strict";
const { validPayload } = require("./jsonSchema");
let { breaker, BASEURL } = require("./circuitBreaker.service");
const axios = require("axios");

async function handleCallback(req, res, next) {
  console.log("i rediected");
  console.log(req.body);
  res.send("i did a thing");
}

async function getProviders(req, res, next) {
  const payloadValidation = validPayload(req.body);
  breaker.fallback(() => {
    // console.log(getCache);
    res.send("Sorry, out of service right now");
  });

  if (payloadValidation.valid) {
    const { providers, callbackUrl } = req.body;

    try {
      const providersData = await breaker.fire(providers, callbackUrl);
      // await axios.post(`${BASEURL}/callbackurl`, providersData);
      // res.redirect(200, `${BASEURL}/callbackurl`);
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

module.exports = { getProviders, handleCallback };
