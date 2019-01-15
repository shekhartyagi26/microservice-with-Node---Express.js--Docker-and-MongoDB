var assert = require("assert");
var config = require("config");

var mongooseData = config.get("repository.Mongoose");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var productName = "Javascript: The guide";
var newProductName = "Javascript: The new guide";

var UID = require("../../lib/uid/UID");
var ProductEntity = require("../../entities/ProductEntity");
var ProductMongooseRepository = require("../../repositories/Mongoose/ProductMongooseRepository");

var productRepository = null;
var product = null;
var newProduct = null;

suite('ProductMongooseRepository test', function () {
  before(function () {
    mongoose.connect("mongodb://" + mongooseData.host + ":" + mongooseData.port + "/" + mongooseData.database);

    productRepository = new ProductMongooseRepository();

    product = new ProductEntity(UID.create());
    product.name = productName;
  });

  test("Should add a new ProductEntity into ProductMongooseRepository", function (done) {
    productRepository.add(product).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the ProductEntity from ProductMongooseRepository", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      assert(dbProduct instanceof ProductEntity, "The repository Product is NOT an instance of ProductEntity");
      assert(dbProduct.uid === product.uid, "The Product uid is NOT == " + product.uid + ", but:" + dbProduct.uid);
      assert(dbProduct.name === productName, "The Product name is NOT == '" + productName + "', but:" + dbProduct.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should update the ProductEntity into ProductMongooseRepository", function (done) {
    product.name = newProductName;

    productRepository.update({
      uid: product.uid
    }, product).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the ProductEntity from ProductMongooseRepository and check the new name", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      assert(dbProduct instanceof ProductEntity, "The repository product is NOT an instance of ProductEntity");
      assert(dbProduct.uid === product.uid, "The product id is NOT == " + product.uid + ", but:" + dbProduct.uid);
      assert(dbProduct.name === newProductName, "The product name is NOT == '" + newProductName + "', but:" + dbProduct.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should add a new ProductEntity into ProductMongooseRepository", function (done) {
    newProduct = new ProductEntity(UID.create());
    newProduct.name = productName;

    productRepository.add(newProduct).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the two ProductEntity present in ProductMongooseRepository", function (done) {
    productRepository.get().then((dbProducts) => {
      assert(dbProducts.length == 2, "The repository product has NOT length 2, but:" + dbProducts.length);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the first ProductEntity from ProductMongooseRepository", function (done) {
    productRepository.get({
      uid: product.uid
    }).then((dbProducts) => {
      assert(dbProducts.length == 1, "The repository dbProducts has NOT length 1, but:" + dbProducts.length);

      assert(dbProducts[0] instanceof ProductEntity, "The repository dbProducts[0] is NOT an instance of ProductEntity");
      assert(dbProducts[0].uid === product.uid, "The dbProducts[0] id is NOT == " + product.uid + ", but:" + dbProducts[0].id);
      assert(dbProducts[0].name === newProductName, "The dbProducts[0] name is NOT == '" + newProductName + "', but:" + dbProducts[0].name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the two ProductEntities ordered by uid from ProductMongooseRepository", function (done) {
    productRepository.get({
      uid: { $in: [product.uid, newProduct.uid] }
    }, {
      sort: {uid: -1}
    }).then((dbProducts) => {
      assert(dbProducts.length == 2, "The repository dbProducts has NOT length 2, but:" + dbProducts.length);

      dbProducts.forEach((dbProduct, idx) => {
        if(idx > 0) {
          assert(dbProduct.uid < dbProducts[idx - 1].uid, "The current product is NOT less than the previous one");
        }
      });

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should remove the first ProductEntity from ProductMongooseRepository", function (done) {
    productRepository.remove({
      uid: product.uid
    }).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should remove the second ProductEntity from ProductMongooseRepository", function (done) {
    productRepository.remove({
      uid: newProduct.uid
    }).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should NOT get the ProductEntity from ProductMongooseRepository", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      if (dbProduct === undefined) {
        return done();
      }

      throw new Error("ProductEntity found into ProductMongooseRepository");
    }, err => {
      throw new Error(err);
    });
  });

  after(function () {
    mongoose.connection.close();
  })
});