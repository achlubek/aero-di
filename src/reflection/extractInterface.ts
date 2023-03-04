import * as path from "path";
import * as ts from "typescript";

import {
  InterfaceData,
  MethodData,
  ParameterData,
  PropertyData,
} from "@app/reflection/dataInterfaces";
import { GenerateReflectionOptions } from "@app/reflection/generateReflection";

export const extractInterface = (
  baseDir: string,
  src: ts.SourceFile,
  interfaceNode: ts.Node,
  options: GenerateReflectionOptions
): InterfaceData => {
  const children = interfaceNode.getChildren();
  const identifiers = children.filter((n) => ts.isIdentifier(n));
  const name = identifiers[0].getText();

  const fqin = `${path
    .relative(baseDir, src.fileName)
    .replace(/.ts$/, "")
    .replaceAll("\\", "/")}/${name}`;

  let extendsInterface: string | null = null;
  const childWithHeritageClauses = children.find((n) =>
    n.getChildren().some((sn) => ts.isHeritageClause(sn))
  );
  if (childWithHeritageClauses) {
    const extendsClause = childWithHeritageClauses
      .getChildren()
      .find((n) => n.getText().startsWith("extends "));

    if (extendsClause) {
      extendsInterface = extendsClause
        .getChildAt(extendsClause.getChildCount() - 1)
        .getText();
    }
  }
  const subChildren = children.map((c) => c.getChildren()).flat(1);

  const propertySignatures = subChildren.filter((n) =>
    ts.isPropertySignature(n)
  );

  const properties: PropertyData[] = [];

  for (const signature of propertySignatures) {
    const children = signature.getChildren();
    const identifiers = children.filter((s) => ts.isIdentifier(s));
    const typeSeparatorIdentifierIndex = children
      .map((f) => f.getText())
      .indexOf(":");
    if (typeSeparatorIdentifierIndex >= 0 && identifiers.length > 0) {
      const typeIdentifier = children[typeSeparatorIdentifierIndex + 1];
      properties.push({
        name: identifiers[0].getText(),
        type: typeIdentifier.getText().replaceAll(/[\r\n ]/g, ""),
        visibility: "public",
      });
    }
  }

  const methodSignatures = subChildren.filter((n) => ts.isMethodSignature(n));

  const methods: MethodData[] = [];

  for (const signature of methodSignatures) {
    const children = signature.getChildren();
    const identifiers = children.filter((s) => ts.isIdentifier(s));
    const nodes = children.filter((s) => s.constructor.name === "NodeObject");
    const typeSeparatorIdentifierIndex = children
      .map((f) => f.getText())
      .indexOf(":");
    if (typeSeparatorIdentifierIndex >= 0 && identifiers.length > 0) {
      const typeIdentifier = children[typeSeparatorIdentifierIndex + 1];
      const methodName = identifiers[0].getText();
      const methodReturnType = typeIdentifier
        .getText()
        .trim()
        .replaceAll(/[\r\n ]/g, "");
      const parameters: ParameterData[] = [];
      if (nodes.length > 0) {
        const paramsChildren = nodes[0]
          .getChildren()
          .filter((a) => ts.isParameter(a));
        for (const param of paramsChildren) {
          const splitByColon = param.getText().split(":");
          if (splitByColon.length >= 2) {
            parameters.push({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              name: splitByColon.shift()!.trim(),
              type: splitByColon
                .join(":")
                .trim()
                .replaceAll(/[\r\n ]/g, ""),
            });
          }
        }
      }
      methods.push({
        name: methodName,
        returnType: methodReturnType,
        parameters,
        visibility: "public",
      });
    }
  }

  if (options.verbose) {
    // eslint-disable-next-line no-console
    console.log(`Found interface ${name}`);
  }

  return {
    fqin,
    name,
    extendsInterface,
    properties,
    methods,
  };
};
