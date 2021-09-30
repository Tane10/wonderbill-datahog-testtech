/**
 * This function will accept the options for the circuit breaker
 * @param {number} timeoutMs timeout in milliseconds
 * @param {number} errorThresholdPercentage percent of failed requests to trip the circuit
 * @param {number} resetTimeoutMs rest timeout in milliseconds
 * @returns {Object} circuit breaker options object
 */

function CreateCircuitBreakerOptions({
  timeoutMs,
  errorThresholdPercentage,
  resetTimeoutMs,
}) {
  return {
    timeout: timeoutMs, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: errorThresholdPercentage, // When 50% of requests fail, trip the circuit
    resetTimeout: resetTimeoutMs, // After 30 seconds, try again.
  };
}

module.exports = { CreateCircuitBreakerOptions };
