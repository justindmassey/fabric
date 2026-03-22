function indentString(text, indent) {
  let pad = "  ".repeat(indent);
  return text
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}

function setToString(set, indent = 0) {
  let pad = "  ".repeat(indent);

  let elements = [];
  for (let element of set) {
    if (element instanceof Set) {
      elements.push(setToString(element, 0));
    } else {
      elements.push(element);
    }
  }

  elements.sort();

  if (elements.length === 0) {
    return pad + "{ }";
  }

  let inner = elements
    .map((e) => indentString(e, indent + 1))
    .join(",\n");

  return pad + "{\n" + inner + "\n" + pad + "}";
}

module.exports = setToString;