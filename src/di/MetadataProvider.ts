import { ClassData } from "@app/reflection/dataInterfaces";

export class MetadataProvider {
  public constructor(private classesData: ClassData[]) {}

  public add(...data: ClassData[]): void {
    this.classesData.push(...data);
  }

  public remove(predicate: (c: ClassData) => boolean): void {
    this.classesData = this.classesData.filter(predicate);
  }

  public getAll(): ClassData[] {
    return this.classesData;
  }

  // by Interfaces

  public getByInterface(interfaceName: string): ClassData[] {
    return this.classesData.filter((c) =>
      c.implementsInterfaces.some((ci) => ci === interfaceName)
    );
  }

  // by Extends

  public getByParentClassNameWithRoot(parentClassName: string): ClassData[] {
    const result = this.getByParentClassNameWithoutRoot(parentClassName);
    const root = this.getByClassName(parentClassName);
    if (root) {
      result.push(root);
    }
    return result;
  }

  public getByParentClassNameWithoutRoot(parentClassName: string): ClassData[] {
    const extendsParent = this.classesData.filter(
      (c) => c.extendsClass === parentClassName
    );
    const extendsChildren = extendsParent
      .map((e) => this.getByParentClassNameWithoutRoot(e.name))
      .flat();
    return [...extendsParent, ...extendsChildren];
  }

  // by Class

  public getByClassName(name: string): ClassData | undefined {
    return this.classesData.find((c) => c.name === name);
  }
}
