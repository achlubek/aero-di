import { InterfaceData } from "@app/reflection/dataInterfaces";

export class InterfaceMetadataProvider {
  public constructor(private interfacesData: InterfaceData[]) {}

  public add(...data: InterfaceData[]): void {
    this.interfacesData.push(...data);
  }

  public remove(predicate: (c: InterfaceData) => boolean): void {
    this.interfacesData = this.interfacesData.filter((c) => !predicate(c));
  }

  public getAll(): InterfaceData[] {
    return this.interfacesData;
  }

  // by Extends

  public getByParentInterfaceNameWithRoot(
    parentInterfaceName: string
  ): InterfaceData[] {
    const result =
      this.getByParentInterfaceNameWithoutRoot(parentInterfaceName);
    const root = this.getByInterfaceName(parentInterfaceName);
    if (root) {
      result.push(root);
    }
    return result;
  }

  public getByParentInterfaceNameWithoutRoot(
    parentInterfaceName: string
  ): InterfaceData[] {
    const extendsParent = this.interfacesData.filter(
      (c) => c.extendsInterface === parentInterfaceName
    );
    const extendsChildren = extendsParent
      .map((e) => this.getByParentInterfaceNameWithoutRoot(e.name))
      .flat();
    return [...extendsParent, ...extendsChildren];
  }

  // by Interface

  public getByInterfaceName(name: string): InterfaceData | undefined {
    return this.interfacesData.find((c) => c.name === name);
  }
}
