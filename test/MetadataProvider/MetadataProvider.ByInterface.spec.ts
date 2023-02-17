import { assert } from "chai";

import { MetadataProvider } from "@app/di/MetadataProvider";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("MetadataProvider By Implements", () => {
  it("should return metadata by interface name", () => {
    const testData: ClassData[] = [
      {
        name: "MyClassNoImplements",
        fqcn: "MyPackage/MyClassNoImplements",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
      {
        name: "MyClassImplementsOne",
        fqcn: "MyPackage/MyClassImplementsOne",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: ["HelloInterface"],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
      {
        name: "MyClassImplementsTwo",
        fqcn: "MyPackage/MyClassImplementsTwo",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: ["HelloInterface", "WorldInterface"],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const provider = new MetadataProvider(testData);

    const getByEmptyInterface = provider.getByInterface("");
    const getByNonExistingInterface = provider.getByInterface(
      "NonExistingInteface"
    );

    assert.equal(getByEmptyInterface.length, 0);
    assert.equal(getByNonExistingInterface.length, 0);

    const byHelloInterface = provider.getByInterface("HelloInterface");
    const byWorldInterface = provider.getByInterface("WorldInterface");

    assert.equal(byHelloInterface.length, 2);
    assert.equal(byWorldInterface.length, 1);

    assert.equal(byHelloInterface[0].name, "MyClassImplementsOne");
    assert.equal(byHelloInterface[1].name, "MyClassImplementsTwo");

    assert.equal(byWorldInterface[0].name, "MyClassImplementsTwo");
  });
});
