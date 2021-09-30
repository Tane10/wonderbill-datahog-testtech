const express = require("express");
const router = express.Router();
const getProviders = require("./circuitBreaker.service");

router.get("/healthcheck", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/handle-provider", getProviders);

// call back url
router.post("/callbackurl", (req, res) => {
  console.log(req.body);
});

module.exports = router;
