import { InstancesCache } from "@app/di/InstancesCache";
import { MetadataProvider } from "@app/di/MetadataProvider";
import { ParameterResolver } from "@app/di/ParameterResolver";
import { ClassData, ConstructorOf } from "@app/reflection/dataInterfaces";

export class AeroDI {
  public readonly parameterResolver: ParameterResolver;
  public readonly metadataProvider: MetadataProvider;
  public readonly instancesCache: InstancesCache;

  public constructor(classesData: ClassData[]) {
    this.metadataProvider = new MetadataProvider(classesData);
    this.instancesCache = new InstancesCache();
    this.parameterResolver = new ParameterResolver(this, this.metadataProvider);
    this.registerInstance(this);
  }

  public registerInstance<T extends object>(value: T): void {
    this.registerInstanceForTypeName(value.constructor.name, value);
  }

  public registerInstanceForTypeName<T extends object>(
    typeName: string,
    value: T
  ): void {
    this.instancesCache.save(typeName, value);
    this.metadataProvider.add({
      name: typeName,
      constructorParameters: [],
      ctor: null,
      constructorVisibility: "private",
      extendsClass: null,
      fqcn: typeName,
      implementsInterfaces: [],
    });
  }

  public async getByInterface<T>(interfaceName: string): Promise<T> {
    const implementing =
      this.metadataProvider.getMetadataByInterface(interfaceName);
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
    if (this.instancesCache.get(classData.name)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.instancesCache.get(classData.name) as T;
    }
    const params = await this.parameterResolver.resolveParameters(classData);
    const constructorFunction = await classData.ctor;
    if (!constructorFunction) {
      throw new Error(`Constructor for class ${classData.name} is not public`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new constructorFunction(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.instancesCache.save(classData.name, instance as object);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }

  public async getByClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    const metadata = this.metadataProvider.getMetadataByClass(ctor);
    if (!metadata) {
      throw new Error(`Metadata for class ${ctor.name} not found`);
    }
    return this.getByClassData(metadata);
  }

  public async getByClassName<T>(name: string): Promise<T> {
    const metadata = this.metadataProvider.getMetadataByClassName(name);
    if (!metadata) {
      throw new Error(`Metadata for class ${name} not found`);
    }
    return this.getByClassData(metadata);
  }
}
