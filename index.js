const sets = {};

function evaluate(expression) {
  const comma = /(?<!\\),/;
  let elements;
  if (comma.test(expression)) {
    elements = expression.split(comma);
  } else {
    elements = expression.split(/\s+/);
  }
  elements = elements.map((element) => element.replaceAll("\\,", ",").trim());
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
  return "{" + elements.join(", ") + "}";
}

function printSets() {
  for (let name in sets) {
    console.log(name + " = " + setToString(sets[name]));
  }
}

require("./lib/rl")("{} ", online);
