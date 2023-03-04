export interface ParameterData {
  name: string;
  type: string;
}

export interface PropertyData {
  name: string;
  type: string;
  visibility: "public" | "protected" | "private";
}

export interface MethodData {
  name: string;
  parameters: ParameterData[];
  returnType: string;
  visibility: "public" | "protected" | "private";
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
  properties: PropertyData[];
  ctor: Promise<AnyConstructor> | null;
  isAbstract: boolean;
  methods: MethodData[];
}

export interface InterfaceData {
  fqin: string;
  name: string;
  properties: PropertyData[];
  extendsInterface: string | null;
  methods: MethodData[];
}
