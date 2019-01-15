var IEntityMapper = require("./IEntityMapper");
var ProductEntity = require("../entities/ProductEntity");
var ProductDTO = require("../dto/ProductDTO");

class ProductEntityMapper extends IEntityMapper {
  constructor() {
    super();
  }

  map(productDTO) {
    if (!productDTO instanceof ProductDTO) {
      throw new Error("The object is NOT a valid ProductDTO");
    }

    var productEntity = new ProductEntity(productDTO.uid);
    productEntity.name = productDTO.name;
    productEntity.price = productDTO.price;

    return productEntity;
  }
}

module.exports = ProductEntityMapper
