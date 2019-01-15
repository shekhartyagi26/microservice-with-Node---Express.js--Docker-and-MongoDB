var ProductEntity = require("../../entities/ProductEntity");
var IRepository = require("../IRepository");
var UID = require("../../lib/uid/UID");

class ProductForeRunnerDBRepository extends IRepository {
  constructor(db) {
    super();

    this.collection = db.collection("Product");
  }

  add(product) {
    return new Promise((resolve, reject) => {
      if (!product instanceof ProductEntity) return reject("The first argument is NOT a ProductEntity");

      this.collection
        .insert(product);

      resolve();
    });
  }

  update(query, product) {
    return new Promise((resolve, reject) => {
      if (!query instanceof Object) return reject("The first argument is NOT a valid object");
      if (!product instanceof ProductEntity) return reject("The second argument is NOT a ProductEntity");

      this.collection
        .update(query, {
          $replace: product
        });

      resolve();
    });
  }

  getByUid(uid) {
    return new Promise((resolve, reject) => {
      if (!UID.isValid(uid)) {
        return reject("The first argument is NOT a valid uid");
      }

      var dbProductResults = this.collection
        .find({
          uid: uid
        });

      if (dbProductResults.length == 0) {
        return resolve(undefined);
      }

      try {
        var product = new ProductEntity(dbProductResults[0].uid);
        product.name = dbProductResults[0].name;
        product.price = dbProductResults[0].price;

        resolve(product);
      } catch (err) {
        reject(err);
      }
    });
  }

  mapGetFilters(filters) {
    var getFilters = {};

    if (filters === undefined) {
      return undefined;
    }

    if (filters[this.GET_FILTER_SORT]) {
      getFilters.$orderBy = filters[this.GET_FILTER_SORT];
    }

    if (filters[this.GET_FILTER_SKIP]) {
      getFilters.$skip = filters[this.GET_FILTER_SKIP];
    }

    if (filters[this.GET_FILTER_LIMIT]) {
      getFilters.$limit = filters[this.GET_FILTER_LIMIT];
    }

    return getFilters;
  }

  get(query, filters) {
    return new Promise((resolve, reject) => {
      try {
        filters = this.validateGetFilters(filters);
      } catch (err) {
        return reject(err);
      }

      var getFilters = this.mapGetFilters(filters);

      var dbProductResults = this.collection.find(query, getFilters);

      if (dbProductResults.length == 0) {
        return resolve(undefined);
      }

      try {
        var products = [];

        dbProductResults.forEach(dbProduct => {
          var product = new ProductEntity(dbProduct.uid);
          product.name = dbProduct.name;
          product.price = dbProduct.price;

          products.push(product);
        });

        resolve(products);
      } catch (err) {
        reject(err);
      }
    });
  }

  remove(filter) {
    return new Promise((resolve, reject) => {
      this.collection.remove(filter);

      resolve();
    });
  }
}

module.exports = ProductForeRunnerDBRepository
