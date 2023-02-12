import minimatch from "minimatch";

import { classesReflection } from "../classes-reflection";

import {
  getClassMetadata,
  getClassesImplementingInterface,
} from "@app/classMetadata";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any;

export class DI {
  private readonly registeredConstructors: Constructor[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly createdInstances: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly registeredConstantValues: Record<string, any> = {};

  public async registerByFqcnGlob(glob: string): Promise<void> {
    for (const classData of classesReflection) {
      if (minimatch(classData.fqcn, glob)) {
        this.register(await classData.ctor);
      }
    }
  }

  public register(classConstructor: Constructor): void {
    this.registeredConstructors.push(classConstructor);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerValue(parameterName: string, value: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.registeredConstantValues[parameterName] = value;
  }

  public wireInterface<T>(interfaceName: string): T {
    const implementing = getClassesImplementingInterface(interfaceName);
    if (implementing.length === 0) {
      throw new Error(`No implementations for interface ${interfaceName}`);
    }
    if (implementing.length !== 1) {
      throw new Error(
        `Multiple implementations for interface ${interfaceName}`
      );
    }
    const classData = implementing[0];
    const ctor = this.registeredConstructors.find((c) => {
      const refl = getClassMetadata(c);
      if (refl) {
        return refl.fqcn === classData.fqcn;
      } else {
        return false;
      }
    });
    if (!ctor) {
      throw new Error(`No implementation found for interface ${interfaceName}`);
    }
    const ctorMetadata = getClassMetadata(ctor);
    if (!ctorMetadata) {
      throw new Error(
        `No implementation metadata found for interface ${interfaceName}`
      );
    }
    const paramsDefinitions = ctorMetadata.constructorParameters;
    const params = paramsDefinitions.map((param) => {
      const implementing = getClassesImplementingInterface(param.type);
      if (implementing.length > 0) {
        return this.wireInterface(param.type);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const constValue = this.registeredConstantValues[param.name];
      if (constValue) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return constValue;
      }
      throw new Error(`Cannot wire parameter ${param.name}`);
    });
    if (this.createdInstances[ctorMetadata.name]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.createdInstances[ctorMetadata.name];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new ctor(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[ctorMetadata.name] = instance;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }
}
