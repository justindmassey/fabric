const setToString = require("./set-to-string");

const canonSets = {};

function getSet(set) {
  let canon = setToString(set);
  if (canon in canonSets) {
    return canonSets[canon];
  } else {
    canonSets[canon] = set;
    return set;
  }
}

module.exports = getSet;
