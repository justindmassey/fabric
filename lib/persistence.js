const { readFileSync, writeFileSync, existsSync } = require("fs");
const sets = require("./sets");
const getSet = require("./get-set");
const path = require("path");
const filename = path.join(__dirname, "../fabric.json");

function serializeValue(value) {
  if (value instanceof Set) {
    return [...value].map(serializeValue);
  }
  return value;
}

function deserializeValue(value) {
  if (Array.isArray(value)) {
    return getSet(new Set(value.map(deserializeValue)));
  }
  return value;
}

function clearSets() {
  for (let name of Object.keys(sets)) {
    delete sets[name];
  }
}

function load(path = filename) {
  if (!existsSync(path)) {
    return;
  }

  let data = JSON.parse(readFileSync(path, "utf8"));

  clearSets();

  for (let name of Object.keys(data).sort()) {
    sets[name] = deserializeValue(data[name]);
  }
}

function save(path = filename) {
  let data = {};

  for (let name of Object.keys(sets).sort()) {
    data[name] = serializeValue(sets[name]);
  }

  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

module.exports = {
  load,
  save,
};
