import { assert } from "chai";
import { scan } from "fast-scan-dir-recursive";

import { generateReflectionDataForFiles } from "@app/reflection/generateReflection";

describe("generateReflection for fields", () => {
  it("should fields", async () => {
    const filesAll = await scan("test/reflection/fieldsReflection");
    const generatedAll = generateReflectionDataForFiles(
      "test/reflection",
      filesAll,
      { verbose: false }
    );

    assert.lengthOf(generatedAll.classes, 1);
  });
});
