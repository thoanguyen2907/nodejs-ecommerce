'use strict'

const { BadResponseError } = require("../core/error.response");
const { product, clothes, electronics } = require("../models/product.model")

// define Factory class to create product 

class ProductFactory {
    /*
    type: "Clothes", 
    payload
     */
    static async createProduct(type, payload) {
        switch(type) {
            case "Electronics": 
                return new Electronics(payload).createProduct()
            case "Clothes": 
                return new Clothing(payload).createProduct()
            default: 
                throw new BadResponseError(`Invalid Product Type ${type}`)
        }
    }
}
// define base product class 
class Product {
    constructor( {
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }) {
    this.product_name = product_name; 
    this.product_thumb = product_thumb; 
    this.product_description = product_description; 
    this.product_price = product_price; 
    this.product_quantity = product_quantity;
    this.product_type = product_type; 
    this.product_shop = product_shop; 
    this.product_attributes = product_attributes; 
    }

    // create a new product 
    async createProduct() {
        return await product.create(this)
    }
}

// define sub-class from Product 
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create(this.product_attributes); 
        if(!newClothing) throw new BadResponseError("Create new clothes item failed"); 

        const newProduct = await super.createProduct(); 
        if(!newProduct) throw new BadResponseError("create new product error"); 

        return newProduct; 
    }
}
 
class Electronics extends Product {
    async createProduct() {
        const newClothing = await clothes.create(this.product_attributes); 
        if(!newClothing) throw new BadResponseError("Create new clothes item failed"); 

        const newProduct = await super.createProduct(); 
        if(!newProduct) throw new BadResponseError("create new product error"); 

        return newProduct; 
    }
}
module.exports = ProductFactory