'use strict'

const express = require("express")

const securityRoute = require("./access");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router(); 

// check apiKey
router.use(apiKey)

// check permissions 
router.use(permission('0000'))
router.use("/v1/api", securityRoute);

module.exports = router;