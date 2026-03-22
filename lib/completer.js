const sets = require("./sets");

function getAtoms() {
  let atoms = new Set();

  function walk(set) {
    for (let element of set) {
      if (element instanceof Set) {
        walk(element);
      } else {
        atoms.add(element);
      }
    }
  }

  for (let name of Object.keys(sets)) {
    walk(sets[name]);
  }

  return [...atoms].sort();
}

function getTopLevelCommaMode(line) {
  let depth = 0;

  for (let char of line) {
    if (char == "{") {
      depth++;
    } else if (char == "}") {
      depth--;
    } else if (char == "," && depth == 0) {
      return true;
    }
  }

  return false;
}

function getCurrentChunk(line) {
  let commaMode = getTopLevelCommaMode(line);
  let depth = 0;

  for (let i = line.length - 1; i >= 0; i--) {
    let char = line[i];

    if (char == "}") {
      if (depth == 0) {
        return line.slice(i + 1);
      }
      depth++;
    } else if (char == "{") {
      depth--;
      if (depth < 0) {
        return line.slice(i + 1);
      }
    } else if (depth == 0) {
      if (commaMode) {
        if (char == ",") {
          return line.slice(i + 1);
        }
      } else {
        if (/\s/.test(char)) {
          return line.slice(i + 1);
        }
      }
    }
  }

  return line;
}

function completer(line) {
  let setNames = Object.keys(sets).sort();
  let atoms = getAtoms();

  let chunk = getCurrentChunk(line);
  let trimmed = chunk.trimStart();
  let leading = chunk.slice(0, chunk.length - trimmed.length);

  let prefix = trimmed;
  let base = "";
  let options = [];

  if (trimmed.startsWith("$$")) {
    base = "$$";
    prefix = trimmed.slice(2);
    options = setNames;
  } else if (trimmed.startsWith("$")) {
    base = "$";
    prefix = trimmed.slice(1);
    options = setNames;
  } else if (line.trimStart().startsWith("!") && line.trim() == trimmed) {
    base = "!";
    prefix = trimmed.slice(1);
    options = setNames;
  } else {
    options = atoms;
  }

  let matches = options
    .filter((option) => option.startsWith(prefix))
    .map((option) => leading + base + option);

  return [matches, chunk];
}

module.exports = completer;
