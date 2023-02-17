import { assert } from "chai";

import { MetadataProvider } from "@app/di/MetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("MetadataProvider By Extends", () => {
  it("should return metadata by extended class", () => {
    const testData: ClassData[] = [
      {
        name: "MyClassNoExtends",
        fqcn: "MyPackage/MyClassNoExtends",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
      },
      {
        name: "MyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassA",
      },
      {
        name: "MyClassExtendsMyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsMyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "MyClassExtendsClassA",
      },
      {
        name: "MyClassExtendsClassB",
        fqcn: "MyPackage/MyClassExtendsClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassB",
      },
    ];

    const provider = new MetadataProvider(testData);

    const getByEmptyParentName = provider.getByParentClassName("");
    const getByNonExistingParentName =
      provider.getByParentClassName("NonExisting");

    assert.equal(getByEmptyParentName.length, 0);
    assert.equal(getByNonExistingParentName.length, 0);

    const byClassA = provider.getByParentClassName("ClassA");
    const byClassB = provider.getByParentClassName("ClassB");

    assert.equal(byClassA.length, 2);
    assert.equal(byClassB.length, 1);

    assert.equal(byClassA[0].name, "MyClassExtendsClassA");
    assert.equal(byClassA[1].name, "MyClassExtendsMyClassExtendsClassA");

    assert.equal(byClassB[0].name, "MyClassExtendsClassB");
  });
});
