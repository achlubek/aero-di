import {
  cleanupTestClasses,
  generateTestClasses,
} from "@test/reflection/generateTestClasses";
import { assert } from "chai";
import { scan } from "fast-scan-dir-recursive";
import * as fs from "fs";

import { ClassData } from "@app/reflection/dataInterfaces";
import { generateReflectionDataForFiles } from "@app/reflection/generateReflection";

describe("generateReflection", () => {
  before(async () => {
    await generateTestClasses();
  });

  after(async () => {
    await cleanupTestClasses();
  });

  it("should parse generated classes in separate files", async () => {
    const filesAll = await scan("test/reflection/testClasses");
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      filesAll,
      { verbose: false }
    );

    const expectedAll = JSON.parse(
      fs.readFileSync("test/reflection/expected.json").toString()
    ) as Record<string, ClassData>;

    assert.equal(generatedAll.length, Object.keys(expectedAll).length);

    for (const generated of generatedAll) {
      const expected = expectedAll[generated.name];
      assert.deepEqual(generated, expected);
    }
  });

  it("should parse generated classes all in one file", () => {
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      ["test/reflection/allInOne.ts"],
      { verbose: false }
    );

    const expectedAll = JSON.parse(
      fs.readFileSync("test/reflection/expectedAllInOne.json").toString()
    ) as Record<string, ClassData>;

    assert.equal(generatedAll.length, Object.keys(expectedAll).length);

    for (const generated of generatedAll) {
      const expected = expectedAll[generated.name];
      assert.deepEqual(generated, expected);
    }
  });

  it("should parse abstract classes", async () => {
    const filesAll = await scan("test/reflection/testClassesManual");
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      filesAll,
      { verbose: false }
    );

    assert.lengthOf(generatedAll, 2);

    assert.isFalse(generatedAll[0].isAbstract);
    assert.equal(generatedAll[0].name, "NonAbstractClass");

    assert.isTrue(generatedAll[1].isAbstract);
    assert.equal(generatedAll[1].name, "AbstractClass");
  });
});
