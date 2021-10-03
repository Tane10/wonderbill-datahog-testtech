const Validator = require("jsonschema").Validator;
let jsonSchemaValidator = new Validator();

const getProvidersSchema = {
  id: "/handle-provider",
  type: "object",
  examples: [
    {
      providers: ["internet", "gas"],
      callbackUrl: "http://localhost:3000/callbackurl",
    },
  ],
  required: ["providers", "callbackUrl"],
  properties: {
    providers: {
      type: "array",
      default: [],
      examples: [["internet", "gas"]],
      additionalItems: true,
    },
    callbackUrl: {
      type: "string",
      examples: ["http://localhost:3000/callbackurl"],
    },
  },
  additionalProperties: true,
};

jsonSchemaValidator.addSchema(getProvidersSchema, "/handle-provider");

function validPayload(body) {
  return jsonSchemaValidator.validate(body, getProvidersSchema);
}

module.exports = { validPayload };
