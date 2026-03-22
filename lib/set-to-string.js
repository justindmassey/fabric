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

module.exports = setToString;
