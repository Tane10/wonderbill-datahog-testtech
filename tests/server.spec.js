const { validPayload } = require("../src/jsonSchema");
const {
  validHandleProviderRequestBody,
  invalidHandleProviderRequestBody,
} = require("./mocks");
const { BASEURL, breaker } = require("../src/circuitBreaker.service");
const { getProviders, handleCallback } = require("../src/provider.service");

describe("ProviderCircuitBreaker", () => {
  test("first test", () => {
    expect(true).toBeTruthy();
  });
});

describe("JsonSchemaValidator should validate a request's body ", () => {
  test("return a valid validator result ", () => {
    const validBody = validPayload(validHandleProviderRequestBody);
    expect(validBody.valid).toBeTruthy();
  });
  test("return a invalid validator result ", () => {
    const inValidBody = validPayload(invalidHandleProviderRequestBody);
    expect(inValidBody.valid).toBeFalsy();
  });
});
