import { assert } from "chai";

import { MetadataProvider } from "@app/di/MetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("MetadataProvider Common", () => {
  it("should return all metadata", () => {
    const testData: ClassData[] = [
      {
        name: "MyClassA",
        fqcn: "MyPackage/MyClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
      {
        name: "MyClassB",
        fqcn: "MyPackage/MyClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const provider = new MetadataProvider(testData);

    const data = provider.getAll();

    assert.deepEqual(data, testData);
  });

  it("should allow metadata removal", () => {
    const testData: ClassData[] = [
      {
        name: "MyClassA",
        fqcn: "MyPackage/MyClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
      {
        name: "MyClassB",
        fqcn: "MyPackage/MyClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const provider = new MetadataProvider(testData);

    const data = provider.getAll();

    assert.deepEqual(data, testData);

    provider.remove((m) => m.name === "MyClassA");

    const data2 = provider.getAll();

    assert.deepEqual(
      data2,
      testData.filter((m) => m.name !== "MyClassA")
    );
  });
});
