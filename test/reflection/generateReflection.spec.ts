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
  // it("generates reflection data for a single simple class without a constructor", () => {
  //   const generated = generateReflectionDataForFiles("test", [
  //     "test/reflection/testClasses2/SingleClassNoConstructor.ts",
  //   ]);
  //
  //   assert.lengthOf(generated, 1);
  //
  //   const generatedOne = generated[0];
  //
  //   assert.deepEqual(generatedOne, {
  //     fqcn: "reflection/testClasses2/SingleClassNoConstructor/SingleClassNoConstructor",
  //     name: "SingleClassNoConstructor",
  //     extendsClass: null,
  //     implementsInterfaces: ["Heh<T>"],
  //     constructorParameters: [],
  //     constructorVisibility: "public",
  //     ctor: null,
  //   });
  // });

  before(async () => {
    await generateTestClasses();
  });

  after(async () => {
    await cleanupTestClasses();
  });

  it("checks generated files separate", async () => {
    console.log("Parsing");
    const filesAll = await scan("test/reflection/testClasses");
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      filesAll,
      { verbose: false }
    );
    console.log("Reading expected data");

    const expectedAll = JSON.parse(
      fs.readFileSync("test/reflection/expected.json").toString()
    ) as Record<string, ClassData>;

    console.log("Asserting");
    assert.equal(generatedAll.length, Object.keys(expectedAll).length);

    for (const generated of generatedAll) {
      const expected = expectedAll[generated.name];
      assert.deepEqual(generated, expected);
    }
  });

  it("checks generated files all in one", async () => {
    console.log("Parsing");
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      ["test/reflection/allInOne.ts"],
      { verbose: false }
    );
    console.log("Reading expected data");

    const expectedAll = JSON.parse(
      fs.readFileSync("test/reflection/expectedAllInOne.json").toString()
    ) as Record<string, ClassData>;

    console.log("Asserting");
    assert.equal(generatedAll.length, Object.keys(expectedAll).length);

    for (const generated of generatedAll) {
      const expected = expectedAll[generated.name];
      assert.deepEqual(generated, expected);
    }
  });
});
