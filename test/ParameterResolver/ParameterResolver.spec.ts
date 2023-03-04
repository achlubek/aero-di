import { assert } from "chai";

import { AeroDI } from "@app/di/AeroDI";
import { ParameterResolver } from "@app/di/ParameterResolver";
import {
  ParameterTypeMultipleClassChildrenFoundException,
  ParameterTypeMultipleInterfaceImplementationsFoundException,
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
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForParameterName("myParam", "Hello");

    const resolved = await parameterResolver.resolveParameters(testData[0]);

    assert.equal(resolved[0], "Hello");
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
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForParameterName("otherParam", "Hello");

    try {
      await parameterResolver.resolveParameters(testData[0]);
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
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "myParam",
      "Hello"
    );

    const resolved = await parameterResolver.resolveParameters(testData[0]);

    assert.equal(resolved[0], "Hello");
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
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassNameAndParameterName(
      "MyClass",
      "otherParam",
      "Hello"
    );

    try {
      await parameterResolver.resolveParameters(testData[0]);
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
        properties: [],
        methods: [],
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
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {}
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
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    parameterResolver.registerValueForClassAndParameterName(
      MyClass,
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

  it("should wire when class extends desired type", async () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {}
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyChildClass {}

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [{ name: "myParam", type: "MyParentClass" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyParentClass",
        fqcn: "MyPackage/MyParentClass",
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
        name: "MyChildClass",
        fqcn: "MyPackage/MyChildClass",
        ctor: Promise.resolve(MyChildClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: "MyParentClass",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    const resolved = await parameterResolver.resolveParameters(testData[0]);

    assert.instanceOf(resolved[0], MyChildClass);
  });

  it("should wire when class match", async () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {}
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyParamClass {}

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [{ name: "myParam", type: "MyParamClass" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyParamClass",
        fqcn: "MyPackage/MyParamClass",
        ctor: Promise.resolve(MyParamClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    const resolved = await parameterResolver.resolveParameters(testData[0]);

    assert.instanceOf(resolved[0], MyParamClass);
  });

  it("should fail to wire parameter by interface if multiple implementations found", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [
          { name: "myParam", type: "TestObjectInterface" },
        ],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "TestObject1",
        fqcn: "MyPackage/TestObject1",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: ["TestObjectInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "TestObject2",
        fqcn: "MyPackage/TestObject2",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: ["TestObjectInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    try {
      await parameterResolver.resolveParameters(testData[0]);
      assert.fail();
    } catch (e) {
      assert.instanceOf(
        e,
        ParameterTypeMultipleInterfaceImplementationsFoundException
      );
    }
  });

  it("should fail to wire parameter by parent class if multiple children found", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: null,
        constructorParameters: [{ name: "myParam", type: "TestObjectParent" }],
        implementsInterfaces: [],
        constructorVisibility: "private",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "TestObject1",
        fqcn: "MyPackage/TestObject1",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: "TestObjectParent",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "TestObject2",
        fqcn: "MyPackage/TestObject2",
        ctor: null,
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: "TestObjectParent",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const parameterResolver = new ParameterResolver(new AeroDI(testData));

    try {
      await parameterResolver.resolveParameters(testData[0]);
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ParameterTypeMultipleClassChildrenFoundException);
    }
  });
});
