'use strict'

const express = require("express");
const { asyncHandler } = require("../../utils/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { createProduct } = require("../../controllers/product.controller");

const router = express.Router();

router.use(authentication)
router.post("/", asyncHandler(createProduct));

module.exports = router
