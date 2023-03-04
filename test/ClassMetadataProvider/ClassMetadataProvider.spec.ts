import { assert } from "chai";

import { ClassMetadataProvider } from "@app/di/ClassMetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("ClassMetadataProvider Common", () => {
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
        properties: [],
        methods: [],
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
        properties: [],
        methods: [],
      },
    ];

    const provider = new ClassMetadataProvider(testData);

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
        properties: [],
        methods: [],
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
        properties: [],
        methods: [],
      },
    ];

    const provider = new ClassMetadataProvider(testData);

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
