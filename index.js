const sets = Object.create(null);
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

function split(expression) {
  let elements;
  if (expression.includes(",")) {
    elements = expression.split(",");
  } else {
    elements = expression.split(/\s+/);
  }
  return elements.map((element) => element.trim());
}

function evaluate(expression) {
  expression = expression.replaceAll("{", " ").replaceAll("}", " ");
  let operation = expression.match(/^(.*?)\s*([+\-&|])\s*(.*)$/);
  if (operation) {
    let left = evaluate(operation[1]);
    let operator = operation[2];
    let right = evaluate(operation[3]);
    if (operator == "+") {
      return getSet(left.union(right));
    }
    if (operator == "&") {
      return getSet(left.intersection(right));
    }
    if (operator == "-") {
      return getSet(left.difference(right));
    }
    if (operator == "|") {
      return getSet(left.symmetricDifference(right));
    }
  }
  let elements = split(expression);
  let result = [];
  for (let element of elements) {
    if (element.startsWith("$$")) {
      let set = sets[element.slice(2)];
      if (set) {
        for (let elem of set) {
          result.push(elem);
        }
      }
    } else if (element.startsWith("$")) {
      result.push(sets[element.slice(1)]);
    } else {
      result.push(element);
    }
  }
  return getSet(new Set(result.filter(Boolean)));
}

function getAssignment(line) {
  let assignment = line.match(/^([^:]+):\s*(.*)\s*$/);
  if (assignment) {
    let name = assignment[1].trim();
    if (name) {
      return {
        name: name,
        expression: assignment[2],
      };
    }
  }
}

function online(line) {
  let removal = line.match(/^!(.*)/);
  if (removal) {
    delete sets[removal[1].trim()];
    printSets();
    return;
  }
  let assignment = getAssignment(line);
  if (assignment) {
    sets[assignment.name] = evaluate(assignment.expression);
    printSets();
  } else {
    console.log(setToString(evaluate(line)));
  }
}

function setToString(set) {
  let elements = [];
  for (let element of set) {
    if (element instanceof Set) {
      elements.push(setToString(element));
    } else {
      elements.push(element);
    }
  }
  return "{ " + elements.sort().join(", ") + " }";
}

function printSets() {
  for (let name in sets) {
    console.log(name + " = " + setToString(sets[name]));
  }
}

require("./lib/rl")("\x1b[36m{}\x1b[0m ", online);
