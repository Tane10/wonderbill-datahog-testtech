const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  transports: new winston.transports.Console(),
  format: winston.format.json(),
});

module.exports = logger;
