"use strict";
const axios = require("axios");
const logger = require("./logger");

class CircuitBreaker {
  logger;
  lastFailedCall = 0;
  retryTimer = 1000;
  failedCallsCounter = 0;
  healthCheckUrl = "http://localhost:3000/healthcheck";
  constructor() {
    this.logger = logger;
  }

  async healthCheck() {
    const currentTime = Date.now();

    if (this.lastFailedCall && currentTime - this.lastFailedCall) {
      this.logger.info("Skipping call, server not available");
      return;
    }

    try {
      const healthCheckResponse = await axios.get(this.healthCheckUrl);
      this.logger.info(healthCheckResponse.data);
      this.lastFailedCall = 0;
    } catch (error) {
      this.lastFailedCall = Date.now();
      this.failedCallsCounter++;
      this;
      if (error.header === 500) {
        this.logger.error("Call failed, service currently not available");
      } else {
      }
      this.logger.error(error.header);
    }
  }
}

// const circuitbreaker = () => {
//   let lastFailedCall = 0;

//   return {
//     healthCheck: async () => {
//       const timeNow = Date.now();

//       if (lastFailedCall && now - lastFailedCall <= 5000) {
//         logger.log("skipping call");
//         return;
//       }

//       try {
//         const healthCheck = await axios.get(
//           "http://localhost:3000/healthcheck"
//         );

//         logger.info(healthCheck.data);
//       } catch (error) {
//         logger.warn(error.message);
//       }
//     },
//   };
// };

module.exports = CircuitBreaker;
