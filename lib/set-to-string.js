function setToString(set, indent = 0, maxWidth = 80) {
  let pad = "  ".repeat(indent);

  let flatElements = [];
  for (let element of set) {
    if (element instanceof Set) {
      flatElements.push(setToString(element, 0, maxWidth));
    } else {
      flatElements.push(element);
    }
  }

  flatElements.sort();

  let flat = "{ " + flatElements.join(", ") + " }";

  if (pad.length + flat.length <= maxWidth) {
    return pad + flat;
  } else {
    let childPad = "  ".repeat(indent + 1);

    let elements = [];
    for (let element of set) {
      if (element instanceof Set) {
        elements.push(setToString(element, indent + 1, maxWidth));
      } else {
        elements.push(childPad + element);
      }
    }

    elements.sort();

    if (elements.length === 0) {
      return pad + "{ }";
    }

    return pad + "{\n" + elements.join(",\n") + "\n" + pad + "}";
  }
}

module.exports = setToString;
