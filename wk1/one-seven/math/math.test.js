// math/math.test.js
const math = require("./math");

describe("Math Module", () => {

  test("add() returns the sum of 2 numbers", () => {
    expect(math.add(2, 3)).toBe(5);
  });

  test("subtract() returns the difference of 2 numbers", () => {
    expect(math.subtract(10, 4)).toBe(6);
  });

  test("multiply() returns the product of 2 numbers", () => {
    expect(math.multiply(6, 7)).toBe(42);
  });

  test("divide() returns the quotient of 2 numbers", () => {
    expect(math.divide(20, 5)).toBe(4);
  });

  // Additional tests using JavaScript Math object
  test("sqrt() returns the square root using Math.sqrt", () => {
    expect(math.sqrt(25)).toBe(5);
  });

  test("max() returns the max of 2 numbers using Math.max", () => {
    expect(math.max(9, 12)).toBe(12);
  });
  
});
