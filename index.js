const sets = {};

function split(expression) {
  if (expression.includes(",")) {
    elements = expression.split(",");
  } else {
    elements = expression.split(/\s+/);
  }
  return elements.map((element) => element.trim());
}

function evaluate(expression) {
  let elements = split(expression)
  for (let i in elements) {
    if (elements[i].startsWith("$")) {
      elements[i] = sets[elements[i].slice(1)];
    }
  }
  return new Set(elements.filter(Boolean));
}

function getAssignment(line) {
  let assignment = line.match(/^([^:]+):\s*(.*)\s*$/);
  if (assignment) {
    return {
      name: assignment[1],
      expression: assignment[2],
    };
  }
}

function online(line) {
  let assignment = getAssignment(line);
  if (assignment) {
    sets[assignment.name] = evaluate(assignment.expression);
    printSets();
  } else {
    console.log(setToString(evaluate(line)))
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
  return "{ " + elements.join(", ") + " }";
}

function printSets() {
  for (let name in sets) {
    console.log(name + " = " + setToString(sets[name]));
  }
}

require("./lib/rl")("\x1b[36m{}\x1b[0m ", online);
