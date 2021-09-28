const Circuitbreaker = require("./circuitBreaker");

const circuitbreaker = Circuitbreaker();

const wait = (time) => {
  return new Promise((resolve) => {
    {
      setTimeout(() => {
        return resolve();
      }, time);
    }
  });
};

(async () => {
  while (true) {
    await circuitbreaker.healthCheck();
    await await wait(1000);
  }
})();

module.exports = wait;
