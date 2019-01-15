var IDTO = require("./IDTO");

class ProductDTO extends IDTO {
  constructor(uid) {
    super(uid);

    this.name = "";
    this.price = 0;
  }
}

module.exports = ProductDTO
