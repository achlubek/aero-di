import { assert } from "chai";

import { AeroDI } from "@app/di/AeroDI";
import { ParameterResolver } from "@app/di/ParameterResolver";
import {
  ParameterTypesIncompatibleException,
  ValueForParameterNotFoundException,
} from "@app/di/exceptions/AeroDIExceptions";
import { ClassData } from "@app/reflection/dataInterfaces";

describe("ParameterResolver", () => {
  it("should wire parameter using global const", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "string" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForParameterName("myParam", "Hello");

    const resolved = await parameterResolver.resolveParameter<string>(
      testData[0],
      testData[0].constructorParameters[0]
    );

    assert.equal(resolved, "Hello");
  });

  it("should fail to wire parameter using global const when global const does not exist", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "string" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForParameterName("otherParam", "Hello");

    try {
      await parameterResolver.resolveParameter<string>(
        testData[0],
        testData[0].constructorParameters[0]
      );
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ValueForParameterNotFoundException);
    }
  });

  it("should wire parameter using local const", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "string" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "myParam",
      "Hello"
    );

    const resolved = await parameterResolver.resolveParameter<string>(
      testData[0],
      testData[0].constructorParameters[0]
    );

    assert.equal(resolved, "Hello");
  });

  it("should fail to wire parameter using local const when local const does not exist", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "string" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "otherParam",
      "Hello"
    );

    try {
      await parameterResolver.resolveParameter<string>(
        testData[0],
        testData[0].constructorParameters[0]
      );
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ValueForParameterNotFoundException);
    }
  });

  it("should fail to wire parameter using const when types do not match", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "string" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "myParam",
      123
    );

    try {
      await parameterResolver.resolveParameters(testData[0]);
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ParameterTypesIncompatibleException);
    }
  });

  it("should fail to wire parameter using object when types do not match", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "TestObject" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "myParam",
      {}
    );

    try {
      await parameterResolver.resolveParameters(testData[0]);
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ParameterTypesIncompatibleException);
    }
  });
});
