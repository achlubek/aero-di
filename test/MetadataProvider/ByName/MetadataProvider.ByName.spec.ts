import { assert } from "chai";

import { MetadataProvider } from "@app/di/MetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("MetadataProvider By Name", () => {
  it("should return metadata by class name", () => {
    const testData: ClassData[] = [
      {
        name: "MyClassA",
        fqcn: "MyPackage/MyClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
      },
      {
        name: "MyClassB",
        fqcn: "MyPackage/MyClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
      },
    ];

    const provider = new MetadataProvider(testData);

    const getByEmptyName = provider.getByClassName("");
    const getByNonExistingName = provider.getByClassName("NonExisting");

    assert.isUndefined(getByEmptyName);
    assert.isUndefined(getByNonExistingName);

    const byClassA = provider.getByClassName("MyClassA");
    const byClassB = provider.getByClassName("MyClassB");

    assert.isDefined(byClassA);
    assert.isDefined(byClassB);

    assert.equal(byClassA?.name, "MyClassA");
    assert.equal(byClassB?.name, "MyClassB");
  });
});
