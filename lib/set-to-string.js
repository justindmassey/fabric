function setToString(set, indent = 0) {
  let pad = "  ".repeat(indent);

  let elements = [];
  for (let element of set) {
    if (element instanceof Set) {
      elements.push(setToString(element, indent + 2));
    } else {
      elements.push(element);
    }
  }

  elements.sort();

  if (elements.length === 0) {
    return "{ }";
  }

  let inner = elements
    .map((e) => "  ".repeat(indent + 2) + e)
    .join(",\n");

  return "{\n" + inner + "\n" + pad + "}";
}

module.exports = setToString;
