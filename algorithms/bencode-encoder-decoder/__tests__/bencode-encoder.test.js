const encodeBencode = require("../own-challenges/encoder-bencode");

describe("encodeBencode", () => {
  test("should encode an array containing a string and an integer into bencoded format", () => {
    const decoded = ["hello", 52];
    const encoded = "l5:helloi52ee";
    const result = encodeBencode(decoded);
    expect(result).toEqual(encoded);
  });

  test("should encode a string", () => {
    const decoded = "world";
    const encoded = "5:world";
    const result = encodeBencode(decoded);
    expect(result).toStrictEqual(encoded);
  });

  test("should encode a integer", () => {
    const decoded = 100;
    const encoded = "i100e";
    const result = encodeBencode(decoded);
    expect(result).toStrictEqual(encoded);
  });

  test("should decode a object", () => {
    const bencodedValue = "d3:foo3:bar5:helloi52ee";
    const expectedOutput = { foo: "bar", hello: 52 };
    const result = encodeBencode(expectedOutput);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should decode a nested object with a list and integers", () => {
    const bencodedValue =
      "d10:inner_dictd4:key16:value14:key2i42e8:list_keyl5:item15:item2i3eeee";
    const expectedOutput = {
      inner_dict: {
        key1: "value1",
        key2: 42,
        list_key: ["item1", "item2", 3],
      },
    };
    const result = encodeBencode(expectedOutput);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should decode a object and string list", () => {
    const bencodedValue = "d4:spaml1:a1:bee";
    const expectedOutput = { spam: ["a", "b"] };
    const result = decodeBencode(bencodedValue);
    expect(result).toStrictEqual(expectedOutput);
  });

  test("should decode a object ,integer,string list", () => {
    const bencodedValue = "d4:spaml1:ai52ee";
    const expectedOutput = { spam: ["a", 52] };
    const result = decodeBencode(bencodedValue);
    expect(result).toStrictEqual(expectedOutput);
  });

  test("should decode an empty list", () => {
    const bencodedValue = "le";
    const expectedOutput = [];
    const result = decodeBencode(bencodedValue);
    expect(result).toStrictEqual(expectedOutput);
  });

  test("should decode a bencoded list with a string and an integer", () => {
    const bencodedValue = "l4:peari754ee";
    const expectedOutput = ["pear", 754];
    const result = decodeBencode(bencodedValue);
    expect(result).toStrictEqual(expectedOutput);
  });

  test("should decode a bencoded 2D list  with a string and an integer", () => {
    const bencodedValue = "lli707e9:blueberryee";
    const expectedOutput = [[707, "blueberry"]];
    const result = encodeBencode(expectedOutput);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should decode a bencoded list with a string and an integer", () => {
    const bencodedValue = "l9:pineapplei119ee";
    const expectedOutput = ["pineapple", 119];
    const result = encodeBencode(expectedOutput);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should encode string and an integer", () => {
    const bencodedValue = "l10:strawberryi513ee";
    const expectedOutput = ["strawberry", 513];
    const result = encodeBencode(expectedOutput);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should encode nested list and an integer", () => {
    const bencodedValue = "lli4eei5ee"; // bencoded string
    const expectedOutput = [[4], 5]; // Expected result: a nested list and integer
    const result = encodeBencode(expectedOutput);
    console.log('result',result);
    expect(result).toStrictEqual(bencodedValue);
  });

  test("should encode 2D list with an integer and a string", () => {
    const bencodedValue = "lli458e5:grapeee"; // Input bencoded string
    const expectedOutput = [[458, "grape"]]; // Expected output: a nested list with an integer and a string
    const result = encodeBencode(expectedOutput); // Call the decode function
    expect(result).toStrictEqual(bencodedValue); // Assert the result matches the expected output
  });
});
