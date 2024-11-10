"use strict";

//const { Types } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey
      // });
      // return tokens? tokens.publicKey : null
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };
  static removeKeyById = async (id) => {
    return await keytokenModel.removeKeyById(id);
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken });
  };
    static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };
  static deleteKeyByUserId = async (userId) => {
    return await keytokenModel.findByIdAndDelete({user: userId})
  }
}

module.exports = KeyTokenService;
