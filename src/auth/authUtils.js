"use strict";

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { findByUserId } = require("../services/keyToken.service");
const { NotFoundError, UnauthorizedResponseError } = require("../core/error.response");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    console.log("createTokenPair ", createTokenPair);
    // access token
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "4h",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });
    console.log("accessToken ", accessToken);
    console.log("refreshToken ", refreshToken);

    jwt.verify(
      accessToken,
      publicKey,
      { algorithms: ["RS256"] },
      (err, decode) => {
        if (err) {
          console.error("Error verify ", err);
        } else {
          console.log("decode verify ", decode);
        }
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  console.log("userId ", userId);
  if (!userId) throw new UnauthorizedResponseError("Invalid Request");

  const keyStore = await findByUserId(userId);
  console.log("keyStore ", keyStore);
  if (!keyStore || !keyStore.publicKey)
    throw new NotFoundError("Keystore is not found");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(" ")[1];
  if (!accessToken) throw new NotFoundError("AccessToken is not found");

  try {
    console.log(accessToken);
    console.log("keyStore.publicKey", keyStore.publicKey);

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJmNWI3ZjYwMzRjZmY2N2VmZmU0YmYiLCJlbWFpbCI6Im5hcmEiLCJpYXQiOjE3MzExODU1NzksImV4cCI6MTczMTE5OTk3OX0.yPvx6exrXxrS0OFCm72qFWDe3Rnj4D2N5zYfYoXg5clbrU7GOQeNvmeM5vYtnUo_7TK31j6otclz05cUr75ID9B3-WtkbLTR3TswzjfFIS-yVFi8KyazwlGcwRw-fYUcqsAFWK3JnOPpe_UWIQq31uyUS2_VaNta13WKegaVQ9-UW1wiVP3A_EnnJ5QmlydmqfqhHgVt-AH0BAXYADRIA0PUn1vG6Ev__GwxH4F-vy-EE9-xVlgnw_QW3j7w8pmD2qj3dBSdKHSxVnp4D_tpthoX_is69lJK-UKDpuDWQ-iajYcazf-TiQ2pKNKhxFCt--mWoHkfivjPAgYU9yOSJw'; 
    // const decodedUser = jwt.verify(accessToken, keyStore.publicKey, {
    //   algorithms: ["RS256"],
    // });

const decodedUser = jwt.decode(token, { complete: true });

    console.log("decodedUser ", decodedUser);
    console.log("userId  ", userId);
    console.log("decodedUser.userId  ", decodedUser.payload.userId);
    if (userId !== decodedUser.payload.userId)
      throw new UnauthorizedResponseError("Invalid user");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
