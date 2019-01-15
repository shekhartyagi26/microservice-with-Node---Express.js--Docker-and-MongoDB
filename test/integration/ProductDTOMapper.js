var assert = require("assert");

var UID = require("../../lib/uid/UID");
var ProductEntity = require("../../entities/ProductEntity");
var ProductDTO = require("../../dto/ProductDTO");
var ProductDTOMapper = require("../../dtoMappers/ProductDTOMapper");

suite('ProductDTOMapper test', function () {
  before(function () {

  });

  test("Should create a new ProductDTOMapper", function (done) {
    var productEntity = new ProductEntity(UID.create());
    productEntity.name = "Javascript";

    var productDTOMapper = new ProductDTOMapper();

    try {
      var product = productDTOMapper.map(productEntity);
    } catch (err) {
      throw new Error("ProductDTO NOT created");
    }

    assert(product instanceof ProductDTO, "Product is NOT an instance of ProductDTO");

    done();
  });
});
