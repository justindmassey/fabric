const sets = require("./lib/sets");
const getSet = require("./lib/get-set");
const setToString = require("./lib/set-to-string");
const completer = require("./lib/completer");
const cartesianProduct = require("./lib/cartesian-product");
const printSets = require("./lib/print-sets");

function isWrapped(expression) {
  expression = expression.trim();
  if (!expression.startsWith("{") || !expression.endsWith("}")) {
    return false;
  }

  let depth = 0;
  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];

    if (char == "{") {
      depth++;
    } else if (char == "}") {
      depth--;
      if (depth == 0 && i < expression.length - 1) {
        return false;
      }
    }

    if (depth < 0) {
      throw new Error("unmatched }");
    }
  }

  if (depth != 0) {
    throw new Error("unmatched {");
  }

  return true;
}

function findTopLevelOperator(expression) {
  let depth = 0;

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];

    if (char == "{") {
      depth++;
    } else if (char == "}") {
      depth--;
      if (depth < 0) {
        throw new Error("unmatched }");
      }
    } else if (depth == 0 && "+-&|*".includes(char)) {
      return i;
    }
  }

  if (depth != 0) {
    throw new Error("unmatched {");
  }
}

function splitTopLevel(expression) {
  let commaMode = false;
  let depth = 0;

  for (let char of expression) {
    if (char == "{") {
      depth++;
    } else if (char == "}") {
      depth--;
      if (depth < 0) {
        throw new Error("unmatched }");
      }
    } else if (char == "," && depth == 0) {
      commaMode = true;
      break;
    }
  }

  if (depth != 0) {
    throw new Error("unmatched {");
  }

  let elements = [];
  let current = "";
  depth = 0;

  function pushCurrent() {
    if (current.trim()) {
      elements.push(current.trim());
      current = "";
    }
  }

  for (let char of expression) {
    if (char == "{") {
      if (depth == 0) {
        pushCurrent();
      }
      depth++;
      current += char;
    } else if (char == "}") {
      depth--;
      if (depth < 0) {
        throw new Error("unmatched }");
      }
      current += char;
      if (depth == 0) {
        pushCurrent();
      }
    } else if (commaMode && depth == 0 && char == ",") {
      pushCurrent();
    } else if (!commaMode && depth == 0 && /\s/.test(char)) {
      pushCurrent();
    } else {
      current += char;
    }
  }

  if (depth != 0) {
    throw new Error("unmatched {");
  }

  pushCurrent();
  return elements;
}

function evaluateElements(expression) {
  let result = [];

  for (let element of splitTopLevel(expression)) {
    if (element.startsWith("$$")) {
      let set = sets[element.slice(2)];
      if (set) {
        for (let elem of set) {
          result.push(elem);
        }
      }
    } else if (element.startsWith("$")) {
      result.push(sets[element.slice(1)]);
    } else if (isWrapped(element)) {
      result.push(evaluate(element));
    } else {
      result.push(element);
    }
  }

  return getSet(new Set(result.filter(Boolean)));
}

function evaluate(expression) {
  expression = expression.trim();

  if (!expression) {
    return getSet(new Set());
  }

  if (isWrapped(expression)) {
    return evaluate(expression.slice(1, -1));
  }

  let index = findTopLevelOperator(expression);
  if (index != null) {
    let left = evaluate(expression.slice(0, index));
    let operator = expression[index];
    let right = evaluate(expression.slice(index + 1));

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
    if (operator == "*") {
      return cartesianProduct(left, right);
    }
  }

  return evaluateElements(expression);
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
  try {
    if (!line) {
      printSets();
    } else {
      let removal = line.match(/^!(.*)/);
      if (removal) {
        delete sets[removal[1].trim()];
      } else {
        let assignment = getAssignment(line);
        if (assignment) {
          sets[assignment.name] = evaluate(assignment.expression);
        } else {
          console.log(setToString(evaluate(line)));
        }
      }
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

require("./lib/rl")("\x1b[36m{}\x1b[0m ", online, completer);
