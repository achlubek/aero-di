import { ClassData } from "@app/reflection/dataInterfaces";

export class MetadataProvider {
  public constructor(private readonly classesData: ClassData[]) {}

  public add(...data: ClassData[]): void {
    this.classesData.push(...data);
  }

  // by Interfaces

  public getByInterface(interfaceName: string): ClassData[] {
    return this.classesData.filter((c) =>
      c.implementsInterfaces.some((ci) => ci === interfaceName)
    );
  }

  // by Extends

  public getByParentClassName(parentClassName: string): ClassData[] {
    const extendsParent = this.classesData.filter(
      (c) => c.extendsClass === parentClassName
    );
    const extendsChildren = extendsParent
      .map((e) => this.getByParentClassName(e.name))
      .flat();
    return [...extendsParent, ...extendsChildren];
  }

  // by Class

  public getByClassName(name: string): ClassData | undefined {
    return this.classesData.find((c) => c.name === name);
  }
}
