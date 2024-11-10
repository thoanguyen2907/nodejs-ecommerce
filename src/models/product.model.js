"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME_PRODUCT = "Product";
const DOCUMENT_NAME_CLOTHES = "Clothes";
const DOCUMENT_NAME_ELECTRONICS = "Electronics";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothes", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// define the product type = clothing

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);
// define the product type = electronics
const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME_PRODUCT, productSchema),
  electronics: model(DOCUMENT_NAME_ELECTRONICS, electronicsSchema),
  clothes: model(DOCUMENT_NAME_CLOTHES, clothingSchema),
};
