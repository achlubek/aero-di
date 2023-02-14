import { ClassData, ConstructorOf } from "@app/reflection/dataInterfaces";

export class MetadataProvider {
  public constructor(private readonly classesData: ClassData[]) {}

  public add(...data: ClassData[]): void {
    this.classesData.push(...data);
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
