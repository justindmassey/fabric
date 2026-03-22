function setToString(set, indent = 0) {
  let pad = "  ".repeat(indent);
  let childPad = "  ".repeat(indent + 1);

  let elements = [];
  for (let element of set) {
    if (element instanceof Set) {
      elements.push(setToString(element, indent + 1));
    } else {
      elements.push(childPad + element);
    }
  }

  elements.sort();

  if (elements.length == 0) {
    return pad + "{ }";
  }

  return pad + "{\n" + elements.join(",\n") + "\n" + pad + "}";
}

module.exports = setToString;