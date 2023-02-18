import { InstancesCache } from "@app/di/InstancesCache";
import { MetadataProvider } from "@app/di/MetadataProvider";
import { ParameterResolver } from "@app/di/ParameterResolver";
import {
  ClassConstructorNotPublicException,
  ClassIsAbstractException,
  ClassMetadataNotFoundException,
  MultipleClassChildrenFoundException,
  MultipleInterfaceImplementationsFoundException,
  NoClassChildrenFoundException,
  NoInterfaceImplementationsFoundException,
} from "@app/di/exceptions/AeroDIExceptions";
import { ClassData, ConstructorOf } from "@app/reflection/dataInterfaces";

export class AeroDI {
  public readonly parameterResolver: ParameterResolver;
  public readonly metadataProvider: MetadataProvider;
  public readonly instancesCache: InstancesCache;

  public constructor(classesData: ClassData[]) {
    this.metadataProvider = new MetadataProvider(classesData);
    this.instancesCache = new InstancesCache();
    this.parameterResolver = new ParameterResolver(this);
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
      isAbstract: false,
    });
  }

  public async getByClassData<T>(classData: ClassData): Promise<T> {
    if (this.instancesCache.get(classData.name)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.instancesCache.get(classData.name) as T;
    }
    if (classData.isAbstract) {
      throw new ClassIsAbstractException(classData.name);
    }
    const constructorFunction = await classData.ctor;
    if (!constructorFunction) {
      throw new ClassConstructorNotPublicException(classData.name);
    }
    const params = await this.parameterResolver.resolveParameters(classData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    const instance = new constructorFunction(...params);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.instancesCache.save(classData.name, instance as object);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return instance;
  }

  public async getByInterface<T>(interfaceName: string): Promise<T> {
    const implementing = this.metadataProvider.getByInterface(interfaceName);
    if (implementing.length === 0) {
      throw new NoInterfaceImplementationsFoundException(interfaceName);
    }
    if (implementing.length !== 1) {
      throw new MultipleInterfaceImplementationsFoundException(interfaceName);
    }
    const classData = implementing[0];
    return this.getByClassData<T>(classData);
  }

  public async getByClassName<T>(className: string): Promise<T> {
    const metadata = this.metadataProvider.getByClassName(className);
    if (!metadata) {
      throw new ClassMetadataNotFoundException(className);
    }
    return this.getByClassData(metadata);
  }

  public async getByClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    return this.getByClassName(ctor.name);
  }

  public async getByParentClassName<T>(name: string): Promise<T> {
    const extending = this.metadataProvider
      .getByParentClassNameWithoutRoot(name)
      .filter((e) => !e.isAbstract && e.constructorVisibility === "public");
    if (extending.length === 0) {
      throw new NoClassChildrenFoundException(name);
    }
    if (extending.length !== 1) {
      throw new MultipleClassChildrenFoundException(name);
    }
    const classData = extending[0];
    return this.getByClassData<T>(classData);
  }

  public async getByParentClass<T>(ctor: ConstructorOf<T>): Promise<T> {
    return this.getByParentClassName(ctor.name);
  }
}
