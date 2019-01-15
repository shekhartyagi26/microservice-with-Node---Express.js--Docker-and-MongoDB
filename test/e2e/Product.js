var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var UID = require("../../lib/uid/UID");
var ProductDTO = require("../../dto/ProductDTO");

var InsertProduct = require("./lib/InsertProduct");

var server = supertest.agent("http://localhost:4000");

var productUid = UID.create();
var productName = "AngularJs 2";

var product = new ProductDTO(productUid);
product.name = "AngularJs";

var newProductUid = UID.create();
var newProductName = "Javascript";

var newProduct = new ProductDTO(newProductUid);
newProduct.name = newProductName;

suite('Product test', function () {
  before(function () {

  });

  new InsertProduct(server, product).exec();

  test("Should return a response with status: 404 and NO body", function (done) {
    server
      .get('/product/' + UID.create())
      .expect("Content-type", /json/)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should get the previous product", function (done) {
    server
      .get('/product/' + product.uid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resProduct = res.body.data;

        assert(resProduct.hasOwnProperty("uid") && resProduct.uid === product.uid, "The response body data has NOT the insert uid value");
        assert(resProduct.hasOwnProperty("name") && resProduct.name === product.name, "The response body data has NOT the insert name value");

        done();
      });
  });

  test("Should update the previous product and return a response with status: 200 and the product data as body", function (done) {
    product = new ProductDTO(productUid);
    product.name = productName;

    server
      .put('/product/' + productUid)
      .send({
        data: product
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

        var resProduct = res.body.data;

        assert(resProduct.hasOwnProperty("uid") && resProduct.uid === product.uid, "The response body data has NOT the insert uid value");
        assert(resProduct.hasOwnProperty("name") && resProduct.name === product.name, "The response body data has NOT the insert name value");

        done();
      });
  });

  new InsertProduct(server, newProduct).exec();

  test("Should return a response with all products containing the previous two", function (done) {
    server
      .get('/product')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var products = res.body.data;

        [productName, newProductName].forEach(name => {
          assert(products.findIndex(product => product.name == name) >= 0, "The name: '" + name + "' has NOT been found in response body data");
        });

        done();
      });
  });

  test("Should return a response with at most two products", function (done) {
    server
      .get('/product?skip=0&limit=2')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var products = res.body.data;

        assert(products.length <= 2, "The number of products in NOT less or equal to 2, but: " + products.length);

        done();
      });
  });

  test("Should return a response with all products ordered by name", function (done) {
    server
      .get('/product?sort={"name":1}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var products = res.body.data;
        var previousProduct = null;

        products.forEach(product => {
          if (previousProduct !== null) {
            assert(product.name >= previousProduct.name, "The products are NOT ordered by name. Current name: " + product.name + ", previous name: " + previousProduct.name);
          }

          previousProduct = product;
        });

        done();
      });
  });

  test("Should return a response containing the product with uid = '" + productUid + "'", function (done) {
    server
      .get('/product?q={"uid":"' + productUid + '"}')
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        assert(res.body.hasOwnProperty("data") && Array.isArray(res.body.data), "The response body has NOT a 'data' array property");

        var products = res.body.data;

        assert(products.length == 1, "The response body data doesn't contain one product");
        assert(products[0].uid == productUid, "The product uid: '" + productUid + "' has NOT been found in response body data");

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/product/' + productUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });

  test("Should return a response with status: 200 and NO body", function (done) {
    server
      .delete('/product/' + newProductUid)
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        done();
      });
  });
});
