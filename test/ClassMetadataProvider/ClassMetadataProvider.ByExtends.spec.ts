import { assert } from "chai";

import { ClassMetadataProvider } from "@app/di/ClassMetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("ClassMetadataProvider By Extends", () => {
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
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassA",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassExtendsMyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsMyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "MyClassExtendsClassA",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassExtendsClassB",
        fqcn: "MyPackage/MyClassExtendsClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassB",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const provider = new ClassMetadataProvider(testData);

    const getByEmptyParentName = provider.getByParentClassNameWithRoot("");
    const getByNonExistingParentName =
      provider.getByParentClassNameWithRoot("NonExisting");

    assert.equal(getByEmptyParentName.length, 0);
    assert.equal(getByNonExistingParentName.length, 0);

    const byClassA = provider.getByParentClassNameWithRoot("ClassA");
    const byClassB = provider.getByParentClassNameWithRoot("ClassB");

    assert.equal(byClassA.length, 2);
    assert.equal(byClassB.length, 1);

    assert.equal(byClassA[0].name, "MyClassExtendsClassA");
    assert.equal(byClassA[1].name, "MyClassExtendsMyClassExtendsClassA");

    assert.equal(byClassB[0].name, "MyClassExtendsClassB");
  });

  it("should return metadata by extended class with root if root is in the class data", () => {
    const testData: ClassData[] = [
      {
        name: "ClassA",
        fqcn: "MyPackage/MyClassNoExtends",
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
        name: "MyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassA",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassExtendsMyClassExtendsClassA",
        fqcn: "MyPackage/MyClassExtendsMyClassExtendsClassA",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "MyClassExtendsClassA",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassExtendsClassB",
        fqcn: "MyPackage/MyClassExtendsClassB",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: "ClassB",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const provider = new ClassMetadataProvider(testData);

    const getByEmptyParentName = provider.getByParentClassNameWithRoot("");
    const getByNonExistingParentName =
      provider.getByParentClassNameWithRoot("NonExisting");

    assert.equal(getByEmptyParentName.length, 0);
    assert.equal(getByNonExistingParentName.length, 0);

    const byClassA = provider.getByParentClassNameWithRoot("ClassA");
    const byClassB = provider.getByParentClassNameWithRoot("ClassB");

    assert.equal(byClassA.length, 3);
    assert.equal(byClassB.length, 1);

    assert.equal(byClassA[0].name, "MyClassExtendsClassA");
    assert.equal(byClassA[1].name, "MyClassExtendsMyClassExtendsClassA");
    assert.equal(byClassA[2].name, "ClassA");

    assert.equal(byClassB[0].name, "MyClassExtendsClassB");
  });
});
