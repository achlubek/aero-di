import { assert } from "chai";
import { scan } from "fast-scan-dir-recursive";
import * as fs from "fs";

import { run } from "@app/cli/run";
import { ClassData } from "@app/reflection/dataInterfaces";

import sinon = require("sinon");

describe("cli", () => {
  it("should generate reflection data", async () => {
    const sandbox = sinon.createSandbox();

    const spy = sandbox.stub(console, "log");

    const howManyFiles = (await scan("test/reflection/testClassesCli")).length;

    await run({
      baseDir: "test/reflection/testClassesCli",
      outFile: "reflectionCliTestData.ts",
      includeGlob: "**/*.ts",
      excludeGlob: "**/*.spec.ts",
      verbose: true,
      ignoreDuplicates: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const generated = await import(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      "./testClassesCli/reflectionCliTestData"
    );
    fs.unlinkSync("./test/reflection/testClassesCli/reflectionCliTestData.ts");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const generatedData = generated.classesReflection as ClassData[];

    assert.isArray(generatedData);

    assert.equal(spy.callCount, generatedData.length + howManyFiles + 1);

    sandbox.restore();

    assert.lengthOf(generatedData, 5);

    assert.isTrue(generatedData.some((c) => c.name === "ATestClass"));
    assert.isTrue(generatedData.some((c) => c.name === "AnotherTestClass"));
    assert.isTrue(generatedData.some((c) => c.name === "ATestClassIn2"));
    assert.isTrue(generatedData.some((c) => c.name === "AnotherTestClassIn2"));
    assert.isTrue(generatedData.some((c) => c.name === "TestSubDirClass"));
  });
});
