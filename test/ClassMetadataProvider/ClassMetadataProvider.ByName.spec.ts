import { assert } from "chai";

import { ClassMetadataProvider } from "@app/di/ClassMetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("ClassMetadataProvider By Name", () => {
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
