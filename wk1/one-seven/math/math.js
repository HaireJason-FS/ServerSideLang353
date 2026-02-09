// math/math.js
// We don't have to use the math module for the simple operations, but we will for the sqrt and max functions.

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// Required: use JavaScript Math objects
function sqrt(n) {
  return Math.sqrt(n);
}

function max(a, b) {
  return Math.max(a, b);
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  sqrt,
  max,
};
