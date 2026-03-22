const sets = require("./sets");
const setToString = require("./set-to-string");

function printSets() {
  for (let name of Object.keys(sets).sort()) {
    console.log(name + " = " + setToString(sets[name]));
    console.log();
  }
}

module.exports = printSets;
