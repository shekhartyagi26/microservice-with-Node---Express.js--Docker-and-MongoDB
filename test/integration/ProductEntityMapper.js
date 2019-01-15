var assert = require("assert");

var UID = require("../../lib/uid/UID");
var ProductEntity = require("../../entities/ProductEntity");
var ProductDTO = require("../../dto/ProductDTO");
var ProductEntityMapper = require("../../entitiesMappers/ProductEntityMapper");

suite('ProductEntityMapper test', function () {
  before(function () {

  });

  test("Should create a new ProductEntityMapper", function (done) {
    var productDTO = new ProductDTO(UID.create());
    productDTO.name = "Javascript";

    var productEntityMapper = new ProductEntityMapper();

    try {
      var productEntity = productEntityMapper.map(productDTO);
    } catch (err) {
      throw new Error("ProductEntity NOT created");
    }

    assert(productEntity instanceof ProductEntity, "Product is NOT an instance of ProductEntity");

    done();
  });
});
