const validHandleProviderRequestBody = {
  providers: ["gas", "internet"],
  callbackUrl: "http://localhost:3000/callbackurl",
};

const invalidHandleProviderRequestBody = {
  providers: "internet",
  callbackUrl: "http://localhost:3000/callbackurl",
};

module.exports = {
  validHandleProviderRequestBody,
  invalidHandleProviderRequestBody,
};
