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
  ctor: Promise<Constructor> | null;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorParameters: ParameterData[];
  constructorVisibility: "public" | "protected" | "private";
}

export class AeroDI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly createdInstances: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly registeredConstantValues: Record<string, any> = {};

  public constructor(private readonly classesData: ClassData[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[this.constructor.name] = this;
    this.classesData.push({
      name: this.constructor.name,
      constructorParameters: [],
      ctor: null,
      constructorVisibility: "private",
      extendsClass: null,
      fqcn: this.constructor.name,
      implementsInterfaces: [],
    });
  }

  public registerInstance<T extends object>(value: T): void {
    this.createdInstances[value.constructor.name] = value;
    this.classesData.push({
      name: value.constructor.name,
      constructorParameters: [],
      ctor: null,
      constructorVisibility: "private",
      extendsClass: null,
      fqcn: value.constructor.name,
      implementsInterfaces: [],
    });
  }

  public registerInstanceForTypeName<T extends object>(
    typeName: string,
    value: T
  ): void {
    this.createdInstances[typeName] = value;
    this.classesData.push({
      name: typeName,
      constructorParameters: [],
      ctor: null,
      constructorVisibility: "private",
      extendsClass: null,
      fqcn: typeName,
      implementsInterfaces: [],
    });
  }

  public registerValueForParameterName<T>(
    parameterName: string,
    value: T
  ): void {
    this.registeredConstantValues[parameterName] = value;
  }

  public registerValueForClassNameAndParameterName<T>(
    className: string,
    parameterName: string,
    value: T
  ): void {
    this.registeredConstantValues[className + "/" + parameterName] = value;
  }

  public registerValueForClassAndParameterName<T>(
    className: Constructor,
    parameterName: string,
    value: T
  ): void {
    this.registeredConstantValues[className.name + "/" + parameterName] = value;
  }

  public async getByInterface<T>(interfaceName: string): Promise<T> {
    const implementing = this.getMetadataByInterface(interfaceName);
    if (implementing.length === 0) {
      throw new Error(`No implementations for interface ${interfaceName}`);
    }
    if (implementing.length !== 1) {
      throw new Error(
        `Multiple implementations for interface ${interfaceName}`
      );
    }
    const classData = implementing[0];
    return this.getByClassData<T>(classData);
  }

  public async getByClassData<T>(classData: ClassData): Promise<T> {
    if (this.createdInstances[classData.name]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.createdInstances[classData.name];
    }
    const paramsDefinitions = classData.constructorParameters;
    const params = await Promise.all(
      paramsDefinitions.map(async (param) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parameterValue = await this.resolveParameter(classData, param);
        if (typeof parameterValue === "object") {
          const paramObj = parameterValue as object;
          const paramObjMetadata = this.getMetadataByInstance(paramObj);
          if (paramObjMetadata) {
            const implementsInterface =
              paramObjMetadata.implementsInterfaces.some(
                (inter) => inter === param.type
              );
            const isOfType = paramObj.constructor.name === param.type;
            if (!isOfType && !implementsInterface) {
              throw new Error(
                `Cannot wire parameter ${param.name} of class ${classData.name}: Incompatible types: expected ${param.type} but got ${paramObj.constructor.name}`
              );
            }
          }
        } else {
          const paramTypeof = typeof parameterValue;
          if (paramTypeof !== param.type) {
            throw new Error(
              `Cannot wire parameter ${param.name} of class ${classData.name}: Incompatible types: expected ${param.type} but got ${paramTypeof}`
            );
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parameterValue;
      })
    );
    const constructorFunction = await classData.ctor;
    if (!constructorFunction) {
      throw new Error(`Constructor for class ${classData.name} is not public`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new constructorFunction(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.createdInstances[classData.name] = instance;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }

  private async resolveParameter(
    classData: ClassData,
    param: ParameterData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (this.createdInstances[param.type]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.createdInstances[param.type];
    }
    const implementing = this.getMetadataByInterface(param.type);
    if (implementing.length > 0) {
      return await this.getByInterface(param.type);
    }
    const being = this.getMetadataByClassName(param.type);
    if (being) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.getByClassData(being);
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
    throw new Error(
      `Cannot wire parameter ${param.name} of class ${classData.name}`
    );
  }

  public async getByClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    const metadata = this.getMetadataByClass(ctor);
    if (!metadata) {
      throw new Error(`Metadata for class ${ctor.name} not found`);
    }
    return this.getByClassData(metadata);
  }

  public async getByClassName<T>(name: string): Promise<T> {
    const metadata = this.getMetadataByClassName(name);
    if (!metadata) {
      throw new Error(`Metadata for class ${name} not found`);
    }
    return this.getByClassData(metadata);
  }

  public getMetadataByInterface(interfaceName: string): ClassData[] {
    return this.classesData.filter((c) =>
      c.implementsInterfaces.some((ci) => ci === interfaceName)
    );
  }

  public getMetadataByClassName(name: string): ClassData | undefined {
    return this.classesData.find((c) => c.name === name);
  }

  public getMetadataByClass<T>(
    classConstructor: ConstructorOf<T>
  ): ClassData | undefined {
    return this.classesData.find((c) => c.name === classConstructor.name);
  }

  public getMetadataByInstance<T extends object>(
    obj: T
  ): ClassData | undefined {
    return this.classesData.find((c) => c.name === obj.constructor.name);
  }
}
