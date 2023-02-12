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

export class AeroDI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly createdInstances: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly registeredConstantValues: Record<string, any> = {};

  public constructor(private readonly classesData: ClassData[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[this.constructor.name] = this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerInstance(value: object): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[value.constructor.name] = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerInstanceForTypeName(typeName: string, value: object): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[typeName] = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerConstantValue(parameterName: string, value: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.registeredConstantValues[parameterName] = value;
  }

  // todo this cam be done better
  public registerScopedConstantValue(
    className: string,
    parameterName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.registeredConstantValues[className + "/" + parameterName] = value;
  }

  public async autowireInterface<T>(interfaceName: string): Promise<T> {
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
    return this.autowireClassData<T>(classData);
  }

  public async autowireClassData<T>(classData: ClassData): Promise<T> {
    if (this.createdInstances[classData.name]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.createdInstances[classData.name];
    }
    const paramsDefinitions = classData.constructorParameters;
    const params = await Promise.all(
      paramsDefinitions.map(async (param) => {
        if (this.createdInstances[param.type]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this.createdInstances[param.type];
        }
        const implementing = this.getClassesImplementingInterface(param.type);
        if (implementing.length > 0) {
          return await this.autowireInterface(param.type);
        }
        const being = this.getClassNameMetadata(param.type);
        if (being) {
          return await this.autowireClassData(being);
        }
        // global approach
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const constValue = this.registeredConstantValues[param.name];
        if (constValue) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return constValue;
        }
        // scoped approach
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const constScopedValue =
          this.registeredConstantValues[classData.name + "/" + param.name];
        if (constScopedValue) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return constScopedValue;
        }
        throw new Error(`Cannot wire parameter ${param.name}`);
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new (await classData.ctor)(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[classData.name] = instance;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }

  public async autowireClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    const metadata = this.getClassMetadata(ctor);
    if (!metadata) {
      throw new Error(`Metadata for class ${ctor.name} not found`);
    }
    return this.autowireClassData(metadata);
  }

  public async autowireClassName<T>(name: string): Promise<T> {
    const metadata = this.getClassNameMetadata(name);
    if (!metadata) {
      throw new Error(`Metadata for class ${name} not found`);
    }
    return this.autowireClassData(metadata);
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
