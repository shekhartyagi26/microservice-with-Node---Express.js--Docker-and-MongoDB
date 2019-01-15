var IEntity = require("./IEntity");

class ProductEntity extends IEntity {
  constructor(uid) {
    super(uid);

    this.name = "";
    this.price = 0;
  }
}

module.exports = ProductEntity
