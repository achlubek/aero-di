import minimatch from "minimatch";

export interface ParameterData {
  name: string;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorOf<T> = new (...args: any[]) => T;
export interface ClassData {
  fqcn: string;
  name: string;
  ctor: Promise<Constructor>;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorParameters: ParameterData[];
}

export class DI {
  private readonly registeredConstructors: Constructor[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly createdInstances: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly registeredConstantValues: Record<string, any> = {};

  public constructor(private readonly classesData: ClassData[]) {}

  public async registerByFqcnGlob(glob: string): Promise<void> {
    for (const classData of this.classesData) {
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

  public async wireInterface<T>(interfaceName: string): Promise<T> {
    const implementing = this.getClassesImplementingInterface(interfaceName);
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
      const refl = this.getClassMetadata(c);
      if (refl) {
        return refl.fqcn === classData.fqcn;
      } else {
        return false;
      }
    });
    if (!ctor) {
      throw new Error(`No implementation found for interface ${interfaceName}`);
    }
    const ctorMetadata = this.getClassMetadata(ctor);
    if (!ctorMetadata) {
      throw new Error(
        `No implementation metadata found for interface ${interfaceName}`
      );
    }
    return this.wireClassData<T>(ctorMetadata);
  }

  public async wireClassData<T>(classData: ClassData): Promise<T> {
    const paramsDefinitions = classData.constructorParameters;
    const params = await Promise.all(
      paramsDefinitions.map(async (param) => {
        const implementing = this.getClassesImplementingInterface(param.type);
        if (implementing.length > 0) {
          return await this.wireInterface(param.type);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const constValue = this.registeredConstantValues[param.name];
        if (constValue) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return constValue;
        }
        throw new Error(`Cannot wire parameter ${param.name}`);
      })
    );
    if (this.createdInstances[classData.name]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.createdInstances[classData.name];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new (await classData.ctor)(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[classData.name] = instance;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }

  public async wireClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    const metadata = this.getClassMetadata(ctor);
    if (!metadata) {
      throw new Error(`Metadata for class ${ctor.name} not found`);
    }
    return this.wireClassData(metadata);
  }

  public async wireClassName<T>(name: string): Promise<T> {
    const metadata = this.getClassNameMetadata(name);
    if (!metadata) {
      throw new Error(`Metadata for class ${name} not found`);
    }
    return this.wireClassData(metadata);
  }

  public getClassesImplementingInterface(interfaceName: string): ClassData[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return this.classesData.filter((c) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      c.implementsInterfaces.some((ci) => ci === interfaceName)
    );
  }

  public getClassNameMetadata(name: string): ClassData | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return this.classesData.find((c) => c.name === name);
  }

  public getClassMetadata(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classConstructor: new (...args: any[]) => any
  ): ClassData | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return this.classesData.find((c) => c.name === classConstructor.name);
  }

  public getInstanceMetadata(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: object
  ): ClassData | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return this.classesData.find((c) => c.name === obj.constructor.name);
  }
}
