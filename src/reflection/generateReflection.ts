import * as path from "path";
import * as ts from "typescript";

import { ClassData, InterfaceData } from "@app/reflection/dataInterfaces";
import { extractClass } from "@app/reflection/extractClass";
import { extractInterface } from "@app/reflection/extractInterface";

const isClassExported = (classNode: ts.Node): boolean => {
  const chd = classNode.getChildren();
  return chd.length > 0 && chd[0].getText().includes("export");
};
const isInterfaceExported = (interfaceNode: ts.Node): boolean => {
  const chd = interfaceNode.getChildren();
  return chd.length > 0 && chd[0].getText().includes("export");
};

export interface GenerateReflectionOptions {
  verbose?: boolean;
  ignoreDuplicates?: boolean;
}

export function generateReflectionDataForFiles(
  baseDir: string,
  files: string[],
  options: GenerateReflectionOptions = {}
): { classes: ClassData[]; interfaces: InterfaceData[] } {
  const absoluteBaseDir = path.resolve(baseDir);
  const absoluteFiles = files.map((f) => path.resolve(f));
  const program = ts.createProgram(absoluteFiles, {});
  program.getTypeChecker();
  const sourceFiles = program
    .getSourceFiles()
    .filter((s) => !s.isDeclarationFile)
    .filter((s) => absoluteFiles.includes(path.resolve(s.fileName)));

  const classes: ClassData[] = [];
  const interfaces: InterfaceData[] = [];
  for (const sourceFile of sourceFiles) {
    if (options.verbose) {
      // eslint-disable-next-line no-console
      console.log(
        `Analyzing file ${path.relative(absoluteBaseDir, sourceFile.fileName)}`
      );
    }
    const visitor = (node: ts.Node): void => {
      if (ts.isClassDeclaration(node) && isClassExported(node)) {
        const classData = extractClass(
          absoluteBaseDir,
          sourceFile,
          node,
          options
        );
        if (options.ignoreDuplicates !== true) {
          if (classes.some((c) => c.name === classData.name)) {
            throw new Error(`Duplicate class name ${classData.name}`);
          }
        }
        classes.push(classData);
      }
      if (ts.isInterfaceDeclaration(node) && isInterfaceExported(node)) {
        const interfaceData = extractInterface(
          absoluteBaseDir,
          sourceFile,
          node,
          options
        );
        if (options.ignoreDuplicates !== true) {
          if (interfaces.some((c) => c.name === interfaceData.name)) {
            throw new Error(`Duplicate interface name ${interfaceData.name}`);
          }
        }
        interfaces.push(interfaceData);
      }
      ts.forEachChild(node, visitor);
    };
    ts.forEachChild(sourceFile, visitor);
  }
  return { classes, interfaces };
}
