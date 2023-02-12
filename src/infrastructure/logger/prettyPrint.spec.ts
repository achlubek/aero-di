import { assert } from "chai";

import {
  prettyPrint,
  resetStartupTime,
} from "@app/infrastructure/logger/prettyPrint";

describe("prettyPrint", () => {
  it("Correctly formats message from a string source", () => {
    const result = prettyPrint("test-source", "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[test-source]/);
    assert.equal(resultParts[2], "message");
  });

  it("Correctly formats message from a class source", () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class TestClass {}
    const result = prettyPrint(TestClass, "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[TestClass]/);
    assert.equal(resultParts[2], "message");
  });

  it("Correctly formats message from an instance source", () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class TestClass {}
    const result = prettyPrint(new TestClass(), "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[TestClass]/);
    assert.equal(resultParts[2], "message");
  });

  it("Correctly formats message from an undefined source", () => {
    const result = prettyPrint(undefined, "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[undefined]/);
    assert.equal(resultParts[2], "message");
  });

  it("Correctly formats message from a weird source that has constructor with no name", () => {
    const result = prettyPrint({ constructor: {} }, "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[object]/);
    assert.equal(resultParts[2], "message");
  });

  it("Resets startup time", () => {
    resetStartupTime();
    const result = prettyPrint("test-source", "message");
    const resultParts = result.split("\n");
    assert.match(
      resultParts[0],
      /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \d{1,}.\d{2}s \d{1,}ms]/
    );
    assert.match(resultParts[1], /\[test-source]/);
    assert.equal(resultParts[2], "message");
  });
});
