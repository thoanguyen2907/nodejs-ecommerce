"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const {
  BadResponseError,
  UnauthorizedResponseError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    console.log("refreshToken ", refreshToken)
    // check refresh token is used or not ?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // if token is found, not good
    if (foundToken) {
      // decode user to know whom
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log("verifyJWT foundToken")
      console.log({ userId, email });
      // delete suspect
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something wrong! Please login again ! ");
    }
    // if foundToken is not found , it is secured
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken)
      throw new UnauthorizedResponseError("Shop did not registered");
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]-- ", { userId, email });
    // check user by email
    const foundShop = await findByEmail({email});
    if (!foundShop) throw new UnauthorizedResponseError("Shop did not registered");
    // create a  new refreshtoken
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    console.log("holderToken ", holderToken)
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: {userId, email}, 
      tokens
    }
  };
  static logout = async ({ keyStore }) => {
    console.log("keyStore logout AccessService", keyStore);
    const delKey = KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadResponseError("Error: Shop not registered");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new UnauthorizedResponseError("Authentication error");

    // Retrieve the key pair associated with the user
    const keyStore = await KeyTokenService.findByUserId(foundShop._id);
    if (!keyStore) throw new NotFoundError("Key store not found for user");

    // Generate token pair using existing private key
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // Optionally, update the refresh token in the key store if needed
    // keyStore.refreshToken = tokens.refreshToken;
    // await keyStore.save();

    return {
      code: 201,
      metadata: {
        shop: foundShop,
        tokens,
      },
    };
};
static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadResponseError("Error: Shop owner already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Generate and store RSA key pair during sign-up
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });
      
      // Create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
                publicKey,
        privateKey
      );
      
      // Store public and private key along with refresh token in the key store
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      return {
        code: 201,
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    }
};
}
module.exports = AccessService;
