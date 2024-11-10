'use strict'

const express = require("express");
const { signUp, login, logout, handlerRefreshToken } = require("../../controllers/access.controller");
const { asyncHandler } = require("../../utils/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/shop/signup", asyncHandler(signUp));
router.post("/shop/login", asyncHandler(login));

router.use(authentication)
router.post("/shop/logout", asyncHandler(logout));
router.post("/shop/refresh-token", asyncHandler(handlerRefreshToken));


module.exports = router
