const express = require("express");
const router = express.Router();
const { getProviders } = require("./circuitBreaker.service");

router.post("/handle-provider", getProviders);

// router.post("/callbackurl", handleCallback);

module.exports = router;
