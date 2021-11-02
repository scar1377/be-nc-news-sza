const { convertValuesToNumber } = require("../utils/utils.js");

describe("converValuesToNumber", () => {
  test("returns an empty array when passes an empty array", () => {
    const expected = [];
    const actual = convertValuesToNumber([]);
    expect(actual).toEqual(expected);
  });
  test("returns an array with the given key's value string converted to number when passes an array with only one object", () => {
    const expected = [{ name: "Mary", age: 28 }];
    const actual = convertValuesToNumber([{ name: "Mary", age: "28" }], "age");
    expect(actual).toEqual(expected);
  });
  test("returns an array with the given key's value string converted to number when passes an array of multiple object", () => {
    const testArr = [
      { name: "Mary", age: "28", petsNum: "2" },
      { name: "Tom", age: "35", petsNum: "3" },
      { name: "Kate", age: "23", petsNum: "1" },
      { name: "Alex", age: "30", petsNum: "2" },
    ];
    const expected = [
      { name: "Mary", age: "28", petsNum: 2 },
      { name: "Tom", age: "35", petsNum: 3 },
      { name: "Kate", age: "23", petsNum: 1 },
      { name: "Alex", age: "30", petsNum: 2 },
    ];
    const actual = convertValuesToNumber(testArr, "petsNum");
    expect(actual).toEqual(expected);
  });
  test("input does not mutate", () => {
    const input = [
      { name: "Mary", age: "28", petsNum: "2" },
      { name: "Tom", age: "35", petsNum: "3" },
      { name: "Kate", age: "23", petsNum: "1" },
      { name: "Alex", age: "30", petsNum: "2" },
    ];
    const actual = convertValuesToNumber(input, "petsNum");
    expect(actual).not.toBe(input);
  });
});
