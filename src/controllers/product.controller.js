const { Created, SuccessResponse, Ok } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("data is here ", req.body);
    const result = await ProductService.createProduct(
      req.body.product_type,
      req.body
    );
    new SuccessResponse({
      message: "Create a new product success",
      metaData: result,
    }).send(res);
  };
}
module.exports = new ProductController();
