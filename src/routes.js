const express = require("express");
const router = express.Router();
const { getProviders, handleCallback } = require("./provider.service");

router.post("/handle-provider", getProviders);

router.post("/callbackurl", handleCallback);

module.exports = router;
