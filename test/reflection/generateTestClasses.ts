import { scan } from "fast-scan-dir-recursive";
import * as fs from "fs";
import * as path from "path";

import { ClassData, ParameterData } from "@app/reflection/dataInterfaces";

enum ConstructorVisibilityEnum {
  Private,
  Protected,
  Public,
  NotSpecifiedImpliedPublic,
}

const constructorVisibilities = [
  ConstructorVisibilityEnum.Private,
  ConstructorVisibilityEnum.Protected,
  ConstructorVisibilityEnum.Public,
  ConstructorVisibilityEnum.NotSpecifiedImpliedPublic,
];

const constructorVisibilitiesStringMap = {
  [ConstructorVisibilityEnum.Private]: "private",
  [ConstructorVisibilityEnum.Protected]: "protected",
  [ConstructorVisibilityEnum.Public]: "public",
  [ConstructorVisibilityEnum.NotSpecifiedImpliedPublic]: "",
};

const constructorVisibilitiesEnumMap: Record<
  ConstructorVisibilityEnum,
  "public" | "protected" | "private"
> = {
  [ConstructorVisibilityEnum.Private]: "private",
  [ConstructorVisibilityEnum.Protected]: "protected",
  [ConstructorVisibilityEnum.Public]: "public",
  [ConstructorVisibilityEnum.NotSpecifiedImpliedPublic]: "public",
};

const numberOfConstructorParametersArr = [0, 1, 2, 7];

const numberOfConstructorOverloadsArr = [0, 2];

const constructorParameterTypes = [
  "number",
  "string",
  "ConstrainDOMString",
  "ConstrainDOMString<T>",
  "number|undefined",
  "ConstrainDOMString|undefined",
  "ConstrainDOMString<T>|undefined",
];

const constructorParamFieldTypeArr = [
  "",
  "public",
  "protected",
  "private",
  "public readonly",
  "protected readonly",
  "private readonly",
];

const basePathDirs = ["testClasses", "testClasses/subfolder"];

const extendsArr = [undefined, "BaseClass", "BaseGeneric<T>"];

const implementsArr = [
  undefined,
  ["BaseInterface"],
  ["BaseGenericInterface<T>"],
  ["BaseInterface", "BaseSecondInterface"],
  ["BaseGenericInterface<T>", "BaseSecondGenericInterface<T>"],
];

const allInOne: string[] = [];

const expectedDatas: Record<string, ClassData | undefined> = {};
const expectedDatasAllInOne: Record<string, ClassData | undefined> = {};

const toSave: [string, string][] = [];

const isAbstractArr = [false, true];

const generate = (): void => {
  for (const isAbstract of isAbstractArr) {
    for (const constructorVisibility of constructorVisibilities) {
      for (const numberOfConstructorParameters of numberOfConstructorParametersArr) {
        for (const numberOfConstructorOverloads of numberOfConstructorOverloadsArr) {
          for (const constructorParamFieldType of constructorParamFieldTypeArr) {
            for (const implementssa of implementsArr) {
              for (const extendssa of extendsArr) {
                for (const basePathDir of basePathDirs) {
                  const realPath = path.resolve(
                    path.join(__dirname, `/${basePathDir}`)
                  );
                  if (!fs.existsSync(realPath)) {
                    fs.mkdirSync(realPath, { recursive: true });
                  }

                  const className = `${basePathDir.replaceAll("/", "_")}_${
                    isAbstract ? "abstract" : "nonabstract"
                  }_${constructorParamFieldType}_${
                    extendssa?.replaceAll(/[<>]/g, "x") ?? "undefined"
                  }${(implementssa?.join("_") ?? "undefined").replaceAll(
                    /[<>]/g,
                    "x"
                  )}_${numberOfConstructorOverloads}_${numberOfConstructorParameters}_${constructorVisibility}`.replaceAll(
                    /[/ ]/g,
                    "__"
                  );

                  if (expectedDatas[className]) {
                    throw new Error(`conflict with ${className}`);
                  }

                  const fqcn = `${basePathDir}/${className}/${className}`;
                  const filename = `${realPath}/${className}.ts`;

                  const mainCtorParamsDatas: ParameterData[] = [];
                  for (let i = 0; i < numberOfConstructorParameters; i++) {
                    mainCtorParamsDatas.push({
                      name: `param${i}`,
                      type: constructorParameterTypes[i],
                    });
                  }
                  const mainCtorParamsStrings = mainCtorParamsDatas.map((p) => {
                    return `${constructorParamFieldType} ${p.name}: ${p.type}`;
                  });
                  const mainCtorParamsString =
                    mainCtorParamsStrings.join(",\n");

                  const ctorVisibilityString =
                    constructorVisibilitiesStringMap[constructorVisibility];

                  const contructorsStrings: string[] = [];

                  for (let i = 0; i < numberOfConstructorOverloads; i++) {
                    contructorsStrings.push(
                      `${ctorVisibilityString} constructor(${mainCtorParamsString});`
                    );
                  }
                  contructorsStrings.push(
                    `${ctorVisibilityString} constructor(${mainCtorParamsString}) { }`
                  );

                  const extendsString = extendssa ? `extends ${extendssa}` : "";
                  const implementsString = implementssa
                    ? `implements ${implementssa.join(", ")}`
                    : "";

                  const classString = `export${
                    isAbstract ? " abstract" : ""
                  } class ${className} ${extendsString} ${implementsString} {
                ${contructorsStrings.join("\n")}
              }`;
                  toSave.push([filename, classString]);
                  allInOne.push(classString);

                  expectedDatas[className] = {
                    constructorVisibility:
                      constructorVisibilitiesEnumMap[constructorVisibility],
                    name: className,
                    fqcn: fqcn,
                    ctor: null,
                    constructorParameters: mainCtorParamsDatas,
                    extendsClass: extendssa ?? null,
                    implementsInterfaces: implementssa ?? [],
                    isAbstract,
                    properties: [],
                    methods: [],
                  };

                  expectedDatasAllInOne[className] = {
                    constructorVisibility:
                      constructorVisibilitiesEnumMap[constructorVisibility],
                    name: className,
                    fqcn: `allInOne/${className}`,
                    ctor: null,
                    constructorParameters: mainCtorParamsDatas,
                    extendsClass: extendssa ?? null,
                    implementsInterfaces: implementssa ?? [],
                    isAbstract,
                    properties: [],
                    methods: [],
                  };
                }
              }
            }
          }
        }
      }
    }
  }
};

const runSave = async (): Promise<void> => {
  while (toSave.length > 0) {
    const chunk: [string, string][] = [];
    while (chunk.length < 1000 && toSave.length > 0) {
      const elem = toSave.shift();
      if (elem) {
        chunk.push(elem);
      }
    }
    await Promise.all(
      chunk.map(
        async (tuple) => await fs.promises.writeFile(tuple[0], tuple[1])
      )
    );
  }
};

export const generateTestClasses = async (): Promise<void> => {
  generate();
  fs.writeFileSync(__dirname + "/allInOne.ts", allInOne.join("\n\n"));
  fs.writeFileSync(
    __dirname + "/expected.json",
    JSON.stringify(expectedDatas, undefined, 2)
  );
  fs.writeFileSync(
    __dirname + "/expectedAllInOne.json",
    JSON.stringify(expectedDatasAllInOne, undefined, 2)
  );
  await runSave();
};

export const cleanupTestClasses = async (): Promise<void> => {
  const files = await scan(path.join(__dirname, "testClasses"));
  //console.log(files);
  await Promise.all(files.map(async (f) => fs.promises.unlink(f)));
  fs.unlinkSync(__dirname + "/allInOne.ts");
  fs.unlinkSync(__dirname + "/expected.json");
  fs.unlinkSync(__dirname + "/expectedAllInOne.json");
};
