'use strict'

const express = require("express")

const securityRoute = require("./access");
const productRoute = require("./product");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router(); 

// check apiKey
router.use(apiKey)

// check permissions 
router.use(permission('0000'))
router.use("/v1/api", securityRoute);
router.use("/v1/api/products", productRoute);

module.exports = router;