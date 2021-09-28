const axios = require("axios");
const logger = require("./logger");

const circuitbreaker = () => {
  let lastFailedCall = 0;

  return {
    healthCheck: async () => {
      const timeNow = Date.now();

      if (lastFailedCall && now - lastFailedCall <= 5000) {
        logger.log("skipping call");
        return;
      }

      try {
        const healthCheck = await axios.get(
          "http://localhost:3000/healthcheck"
        );

        logger.info(healthCheck.data);
      } catch (error) {
        logger.warn(error.message);
      }
    },
  };
};

module.exports = circuitbreaker;
