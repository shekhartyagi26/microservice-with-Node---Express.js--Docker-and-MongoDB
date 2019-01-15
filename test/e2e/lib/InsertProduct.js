var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

module.exports = function (server, product) {
  return {
    server: server,
    product: product,
    exec: function () {
      test("Should insert a new blog product and return a response with status: 201 and the product data as body", (done) => {
        this.server
          .post('/product/')
          .send({
            data: this.product
          })
          .expect("Content-type", /json/)
          .expect(201)
          .end((err, res) => {
            if (err) throw err;

            assert(res.body.hasOwnProperty("data"), "The response body has NOT 'data' property");

            var product = res.body.data;

            assert(product.hasOwnProperty("uid") && product.uid === this.product.uid, "The response body data has NOT the insert uid value");
            assert(product.hasOwnProperty("name") && product.name === this.product.name, "The response body data has NOT the insert name value");

            done();
          });
      });
    }
  }
}
