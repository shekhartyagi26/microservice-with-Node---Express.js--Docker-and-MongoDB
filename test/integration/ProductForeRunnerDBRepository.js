var assert = require("assert");
var config = require("config");

var database = config.get("repository.ForeRunnerDB.database");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();

var db = fdb.db(database);

var productName = "Javascript: The guide";
var newProductName = "Javascript: The new guide";

var UID = require("../../lib/uid/UID");
var ProductEntity = require("../../entities/ProductEntity");
var ProductForeRunnerDBRepository = require("../../repositories/ForeRunnerDB/ProductForeRunnerDBRepository");

var productRepository = null;
var product = null;

suite('ProductForeRunnerDBRepository test', function () {
  before(function () {
    productRepository = new ProductForeRunnerDBRepository(db);

    product = new ProductEntity(UID.create());
    product.name = productName;
  });

  test("Should add a new ProductEntity into ProductForeRunnerDBRepository", function (done) {
    productRepository.add(product).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the ProductEntity from ProductForeRunnerDBRepository", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      assert(dbProduct instanceof ProductEntity, "The repository Product is NOT an instance of ProductEntity");
      assert(dbProduct.uid === product.uid, "The Product uid is NOT == " + product.uid + ", but:" + dbProduct.uid);
      assert(dbProduct.name === productName, "The Product name is NOT == '" + productName + "', but:" + dbProduct.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should update the ProductEntity into ProductForeRunnerDBRepository", function (done) {
    product.name = newProductName;

    productRepository.update({
      uid: product.uid
    }, product).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the ProductEntity from ProductForeRunnerDBRepository and check the new name", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      assert(dbProduct instanceof ProductEntity, "The repository product is NOT an instance of ProductEntity");
      assert(dbProduct.uid === product.uid, "The product id is NOT == " + product.uid + ", but:" + dbProduct.uid);
      assert(dbProduct.name === newProductName, "The product name is NOT == '" + newProductName + "', but:" + dbProduct.name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should add a new ProductEntity into ProductForeRunnerDBRepository", function (done) {
    var newProduct = new ProductEntity(UID.create());
    newProduct.name = productName;

    productRepository.add(newProduct).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the two ProductEntity present in ProductForeRunnerDBRepository", function (done) {
    productRepository.get().then((dbProducts) => {
      assert(dbProducts.length == 2, "The repository product has NOT length 2, but:" + dbProducts.length);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the ProductEntity from ProductForeRunnerDBRepository", function (done) {
    productRepository.get({
      uid: product.uid
    }).then((dbProduct) => {
      assert(dbProduct.length == 1, "The repository dbProduct has NOT length 1, but:" + dbProduct.length);

      assert(dbProduct[0] instanceof ProductEntity, "The repository dbProduct[0] is NOT an instance of ProductEntity");
      assert(dbProduct[0].uid === product.uid, "The dbProduct[0] id is NOT == " + product.uid + ", but:" + dbProduct[0].id);
      assert(dbProduct[0].name === newProductName, "The dbProduct[0] name is NOT == '" + newProductName + "', but:" + dbProduct[0].name);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should remove the ProductEntity from ProductForeRunnerDBRepository", function (done) {
    productRepository.remove({
      uid: product.uid
    }).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should NOT get the ProductEntity from ProductForeRunnerDBRepository", function (done) {
    productRepository.getByUid(product.uid).then((dbProduct) => {
      if (dbProduct === undefined) {
        return done();
      }

      throw new Error("ProductEntity found into ProductForeRunnerDBRepository");
    }, err => {
      throw new Error(err);
    });
  });

  after(function () {

  });
});
