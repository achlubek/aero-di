import { assert } from "chai";

import { AeroDI } from "@app/di/AeroDI";
import {
  ClassConstructorNotPublicException,
  ClassIsAbstractException,
  ClassMetadataNotFoundException,
  MultipleClassChildrenFoundException,
  MultipleInterfaceImplementationsFoundException,
  NoClassChildrenFoundException,
  NoInterfaceImplementationsFoundException,
} from "@app/di/exceptions/AeroDIExceptions";
import { ClassData } from "@app/reflection/dataInterfaces";

import sinon = require("sinon");

describe("AeroDI", () => {
  it("should wire constructor interface parameter", async () => {
    const constructSpy = sinon.spy();
    const implementingSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface MyInterface {}

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor(myParam: MyInterface) {
        constructSpy(myParam);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class ImplementingClass implements MyInterface {
      // eslint-disable-next-line
      public constructor() {
        implementingSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [{ name: "myParam", type: "MyInterface" }],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "ImplementingClass",
        fqcn: "MyPackage/ImplementingClass",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByClassName<object>("MyClass");

    assert.isTrue(constructSpy.calledOnce);
    assert.isTrue(
      constructSpy.getCall(0).firstArg instanceof ImplementingClass
    );
    assert.equal(wired.constructor.name, "MyClass");
    assert.isTrue(implementingSpy.calledOnce);
  });

  it("should wire a class by interface", async () => {
    const implementingSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface MyInterface {}

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class ImplementingClass implements MyInterface {
      // eslint-disable-next-line
      public constructor() {
        implementingSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "ImplementingClass",
        fqcn: "MyPackage/ImplementingClass",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByInterface<object>("MyInterface");

    assert.equal(wired.constructor.name, "ImplementingClass");
    assert.isTrue(implementingSpy.calledOnce);
  });

  it("should fail to wire a class by interface if multiple implementations", async () => {
    const implementingSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface MyInterface {}

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class ImplementingClass implements MyInterface {
      // eslint-disable-next-line
      public constructor() {
        implementingSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClassImplementsOne",
        fqcn: "MyPackage/MyClassImplementsOne",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "MyClassImplementsTwo",
        fqcn: "MyPackage/MyClassImplementsTwo",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    try {
      await di.getByInterface<object>("MyInterface");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, MultipleInterfaceImplementationsFoundException);
    }

    assert.isTrue(implementingSpy.notCalled);
  });

  it("should fail to wire a class by interface if no implementations", async () => {
    const testData: ClassData[] = [];

    const di = new AeroDI(testData);

    try {
      await di.getByInterface<object>("MyInterface");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, NoInterfaceImplementationsFoundException);
    }
  });

  it("should wire a class by parent class", async () => {
    const constructSpy = sinon.spy();
    const implementingSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor() {
        constructSpy();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class ImplementingClass extends MyClass {
      // eslint-disable-next-line
      public constructor() {
        super();
        implementingSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "ImplementingClass",
        fqcn: "MyPackage/ImplementingClass",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: "MyClass",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByParentClassName<object>("MyClass");
    assert.equal(wired.constructor.name, "ImplementingClass");

    const wired2 = await di.getByParentClass<object>(MyClass);
    assert.equal(wired2.constructor.name, "ImplementingClass");

    assert.isTrue(implementingSpy.calledOnce);
  });

  it("should fail to wire a class by parent class if multiple implementations", async () => {
    const constructSpy = sinon.spy();
    const implementingSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor() {
        constructSpy();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class ImplementingClass extends MyClass {
      // eslint-disable-next-line
      public constructor() {
        super();
        implementingSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "ImplementingClass",
        fqcn: "MyPackage/ImplementingClass",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: "MyClass",
        isAbstract: false,
        properties: [],
        methods: [],
      },
      {
        name: "ImplementingClass2",
        fqcn: "MyPackage/ImplementingClass2",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: "MyClass",
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    try {
      await di.getByParentClassName<object>("MyClass");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, MultipleClassChildrenFoundException);
    }

    assert.isTrue(constructSpy.notCalled);
    assert.isTrue(implementingSpy.notCalled);
  });

  it("should fail to wire a class by parent class if no implementations", async () => {
    const testData: ClassData[] = [];

    const di = new AeroDI(testData);

    try {
      await di.getByParentClassName<object>("MyClass");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, NoClassChildrenFoundException);
    }
  });

  it("should wire a class by name", async () => {
    const constructSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor() {
        constructSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByClassName<object>("MyClass");
    assert.equal(wired.constructor.name, "MyClass");
    const wired2 = await di.getByClass<object>(MyClass);
    assert.equal(wired2.constructor.name, "MyClass");

    assert.isTrue(constructSpy.calledOnce);
  });

  it("should fail to wire an abstract class", async () => {
    const constructSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor() {
        constructSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: true,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    try {
      await di.getByClassName<object>("MyClass");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ClassIsAbstractException);
    }

    assert.isTrue(constructSpy.notCalled);
  });

  it("should fail to wire a class without constructor", async () => {
    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
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

    const di = new AeroDI(testData);

    try {
      await di.getByClassName<object>("MyClass");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ClassConstructorNotPublicException);
    }
  });

  it("should wire again a class by name and retrieve it from cache", async () => {
    const constructSpy = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyClass {
      // eslint-disable-next-line
      public constructor() {
        constructSpy();
      }
    }

    const testData: ClassData[] = [
      {
        name: "MyClass",
        fqcn: "MyPackage/MyClass",
        ctor: Promise.resolve(MyClass),
        constructorParameters: [],
        implementsInterfaces: [],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
        properties: [],
        methods: [],
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByClassName<object>("MyClass");
    assert.equal(wired.constructor.name, "MyClass");

    const wired2 = await di.getByClassName<object>("MyClass");
    assert.equal(wired2.constructor.name, "MyClass");

    assert.isTrue(constructSpy.calledOnce);
  });

  it("should fail to wire a class if no implementations", async () => {
    const testData: ClassData[] = [];

    const di = new AeroDI(testData);

    try {
      await di.getByClassName<object>("MyClass");
      assert.fail();
    } catch (e) {
      assert.instanceOf(e, ClassMetadataNotFoundException);
    }
  });
});
