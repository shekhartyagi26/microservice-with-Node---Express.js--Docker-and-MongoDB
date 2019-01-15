var IDTOMapper = require("./IDTOMapper");
var ProductEntity = require("../entities/ProductEntity");
var ProductDTO = require("../dto/ProductDTO");

class ProductDTOMapper extends IDTOMapper {
  constructor() {
    super();
  }

  map(productEntity) {
    if (!productEntity instanceof ProductEntity) {
      throw new Error("The object is NOT a valid ProductEntity");
    }

    var productDTO = new ProductDTO(productEntity.uid);
    productDTO.name = productEntity.name;
    productDTO.price = productEntity.price;

    return productDTO;
  }
}

module.exports = ProductDTOMapper
