export interface ParameterData {
  name: string;
  type: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any;
export interface ClassData {
  fqcn: string;
  name: string;
  ctor: Promise<Constructor>;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorParameters: ParameterData[];
}

export const classesReflection: ClassData[] = [
  {
    fqcn: "src/infrastructure/configuration/Configuration/Configuration",
    name: "Configuration",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctor: new Promise(
      (r) =>
        void import("./src/infrastructure/configuration/Configuration").then(
          (imp) => r(imp.Configuration)
        )
    ),
    implementsInterfaces: ["ConfigurationInterface"],
    extendsClass: null,
    constructorParameters: [],
  },
  {
    fqcn: "src/infrastructure/logger/Logger/Logger",
    name: "Logger",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctor: new Promise(
      (r) =>
        void import("./src/infrastructure/logger/Logger").then((imp) =>
          r(imp.Logger)
        )
    ),
    implementsInterfaces: ["LoggerInterface"],
    extendsClass: null,
    constructorParameters: [
      {
        name: "config",
        type: "ConfigurationInterface",
      },
    ],
  },
  {
    fqcn: "src/DI/DI",
    name: "DI",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctor: new Promise((r) => void import("./src/DI").then((imp) => r(imp.DI))),
    implementsInterfaces: [""],
    extendsClass: null,
    constructorParameters: [],
  },
  {
    fqcn: "src/main/TestClass",
    name: "TestClass",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctor: new Promise(
      (r) => void import("./src/main").then((imp) => r(imp.TestClass))
    ),
    implementsInterfaces: ["TestClassInterface"],
    extendsClass: null,
    constructorParameters: [
      {
        name: "logger",
        type: "LoggerInterface",
      },
      {
        name: "config",
        type: "ConfigurationInterface",
      },
      {
        name: "testing",
        type: "public readonly",
      },
    ],
  },
];
