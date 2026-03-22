const sets = require("./sets");
const setToString = require("./set-to-string");

function printSets() {
  for (let name of Object.keys(sets).sort()) {
    console.log(name + ":");
    console.log(setToString(sets[name], 1));
    console.log();
  }
}

module.exports = printSets;
