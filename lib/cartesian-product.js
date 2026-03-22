const getSet = require("./get-set");

function cartesianProduct(left, right) {
  let result = [];
  for (let a of left) {
    for (let b of right) {
      result.push(getSet(new Set([a, b])));
    }
  }
  return getSet(new Set(result));
}

module.exports = cartesianProduct;
