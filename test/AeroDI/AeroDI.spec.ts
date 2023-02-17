import { assert } from "chai";

import { AeroDI } from "@app/di/AeroDI";
import { ClassData } from "@app/reflection/dataInterfaces";

import sinon = require("sinon");

describe("AeroDI By Implements", () => {
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
        name: "MyClassImplementsTwo",
        fqcn: "MyPackage/MyClassImplementsTwo",
        ctor: Promise.resolve(ImplementingClass),
        constructorParameters: [],
        implementsInterfaces: ["MyInterface"],
        constructorVisibility: "public",
        extendsClass: null,
        isAbstract: false,
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByInterface<object>("MyInterface");

    assert.equal(wired.constructor.name, "ImplementingClass");
    assert.isTrue(implementingSpy.calledOnce);
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
      },
    ];

    const di = new AeroDI(testData);

    const wired = await di.getByParentClassName<object>("MyClass");

    assert.equal(wired.constructor.name, "ImplementingClass");
    assert.isTrue(implementingSpy.calledOnce);
  });
});
