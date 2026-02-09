const { uppercase, lowercase } = require("./string");

describe("Testing the string module",() =>{
  // test one
  test("should uppercase a string input",()=>{
    // Shorthand:
    // expect(uppercase("bob")).toBe("BOB");

    // Longhand:
    const result = uppercase("bob");
    expect(result).toBe("BOB");
  });

  // test two
  test("should lowercase a string input",() => {
    expect(lowercase("FULLSAIL")).toBe("fullsail");
  });

});