export interface ParameterData {
  name: string;
  type: string;
}

export interface ConstructorData {
  visibility: "public" | "protected" | "private";
  params: ParameterData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConstructorOf<T> = new (...args: any[]) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = ConstructorOf<any>;

export interface ClassData {
  fqcn: string;
  name: string;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorVisibility: "public" | "protected" | "private";
  constructorParameters: ParameterData[];
  ctor: Promise<AnyConstructor> | null;
}
