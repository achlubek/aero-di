#!/usr/bin/env node
import { scan } from "fast-scan-dir-recursive";
import * as fs from "fs";
import minimatch from "minimatch";
import * as path from "path";
import * as prettier from "prettier";
import * as process from "process";
import * as ts from "typescript";
import { parseArgs } from "util";

const initArray = <T>(size: number, constructor: (index: number) => T): T[] => {
  return [...new Array<T>(size)].map((_, i) => constructor(i));
};

const determineType = (node: ts.Node): string => {
  if (ts.isNumericLiteral(node)) return "NumericLiteral";
  if (ts.isBigIntLiteral(node)) return "BigIntLiteral";
  if (ts.isStringLiteral(node)) return "StringLiteral";
  if (ts.isJsxText(node)) return "JsxText";
  if (ts.isRegularExpressionLiteral(node)) return "RegularExpressionLiteral";
  if (ts.isNoSubstitutionTemplateLiteral(node))
    return "NoSubstitutionTemplateLiteral";
  if (ts.isTemplateHead(node)) return "TemplateHead";
  if (ts.isTemplateMiddle(node)) return "TemplateMiddle";
  if (ts.isTemplateTail(node)) return "TemplateTail";
  if (ts.isDotDotDotToken(node)) return "DotDotDotToken";
  if (ts.isPlusToken(node)) return "PlusToken";
  if (ts.isMinusToken(node)) return "MinusToken";
  if (ts.isAsteriskToken(node)) return "AsteriskToken";
  if (ts.isIdentifier(node)) return "Identifier";
  if (ts.isPrivateIdentifier(node)) return "PrivateIdentifier";
  if (ts.isQualifiedName(node)) return "QualifiedName";
  if (ts.isComputedPropertyName(node)) return "ComputedPropertyName";
  if (ts.isTypeParameterDeclaration(node)) return "TypeParameterDeclaration";
  if (ts.isParameter(node)) return "Parameter";
  if (ts.isDecorator(node)) return "Decorator";
  if (ts.isPropertySignature(node)) return "PropertySignature";
  if (ts.isPropertyDeclaration(node)) return "PropertyDeclaration";
  if (ts.isMethodSignature(node)) return "MethodSignature";
  if (ts.isMethodDeclaration(node)) return "MethodDeclaration";
  if (ts.isClassStaticBlockDeclaration(node))
    return "ClassStaticBlockDeclaration";
  if (ts.isConstructorDeclaration(node)) return "ConstructorDeclaration";
  if (ts.isGetAccessorDeclaration(node)) return "GetAccessorDeclaration";
  if (ts.isSetAccessorDeclaration(node)) return "SetAccessorDeclaration";
  if (ts.isCallSignatureDeclaration(node)) return "CallSignatureDeclaration";
  if (ts.isConstructSignatureDeclaration(node))
    return "ConstructSignatureDeclaration";
  if (ts.isIndexSignatureDeclaration(node)) return "IndexSignatureDeclaration";
  if (ts.isTypePredicateNode(node)) return "TypePredicateNode";
  if (ts.isTypeReferenceNode(node)) return "TypeReferenceNode";
  if (ts.isFunctionTypeNode(node)) return "FunctionTypeNode";
  if (ts.isConstructorTypeNode(node)) return "ConstructorTypeNode";
  if (ts.isTypeQueryNode(node)) return "TypeQueryNode";
  if (ts.isTypeLiteralNode(node)) return "TypeLiteralNode";
  if (ts.isArrayTypeNode(node)) return "ArrayTypeNode";
  if (ts.isTupleTypeNode(node)) return "TupleTypeNode";
  if (ts.isNamedTupleMember(node)) return "NamedTupleMember";
  if (ts.isOptionalTypeNode(node)) return "OptionalTypeNode";
  if (ts.isRestTypeNode(node)) return "RestTypeNode";
  if (ts.isUnionTypeNode(node)) return "UnionTypeNode";
  if (ts.isIntersectionTypeNode(node)) return "IntersectionTypeNode";
  if (ts.isConditionalTypeNode(node)) return "ConditionalTypeNode";
  if (ts.isInferTypeNode(node)) return "InferTypeNode";
  if (ts.isParenthesizedTypeNode(node)) return "ParenthesizedTypeNode";
  if (ts.isThisTypeNode(node)) return "ThisTypeNode";
  if (ts.isTypeOperatorNode(node)) return "TypeOperatorNode";
  if (ts.isIndexedAccessTypeNode(node)) return "IndexedAccessTypeNode";
  if (ts.isMappedTypeNode(node)) return "MappedTypeNode";
  if (ts.isLiteralTypeNode(node)) return "LiteralTypeNode";
  if (ts.isImportTypeNode(node)) return "ImportTypeNode";
  if (ts.isTemplateLiteralTypeSpan(node)) return "TemplateLiteralTypeSpan";
  if (ts.isTemplateLiteralTypeNode(node)) return "TemplateLiteralTypeNode";
  if (ts.isObjectBindingPattern(node)) return "ObjectBindingPattern";
  if (ts.isArrayBindingPattern(node)) return "ArrayBindingPattern";
  if (ts.isBindingElement(node)) return "BindingElement";
  if (ts.isArrayLiteralExpression(node)) return "ArrayLiteralExpression";
  if (ts.isObjectLiteralExpression(node)) return "ObjectLiteralExpression";
  if (ts.isPropertyAccessExpression(node)) return "PropertyAccessExpression";
  if (ts.isElementAccessExpression(node)) return "ElementAccessExpression";
  if (ts.isCallExpression(node)) return "CallExpression";
  if (ts.isNewExpression(node)) return "NewExpression";
  if (ts.isTaggedTemplateExpression(node)) return "TaggedTemplateExpression";
  if (ts.isTypeAssertionExpression(node)) return "TypeAssertionExpression";
  if (ts.isParenthesizedExpression(node)) return "ParenthesizedExpression";
  if (ts.isFunctionExpression(node)) return "FunctionExpression";
  if (ts.isArrowFunction(node)) return "ArrowFunction";
  if (ts.isDeleteExpression(node)) return "DeleteExpression";
  if (ts.isTypeOfExpression(node)) return "TypeOfExpression";
  if (ts.isVoidExpression(node)) return "VoidExpression";
  if (ts.isAwaitExpression(node)) return "AwaitExpression";
  if (ts.isPrefixUnaryExpression(node)) return "PrefixUnaryExpression";
  if (ts.isPostfixUnaryExpression(node)) return "PostfixUnaryExpression";
  if (ts.isBinaryExpression(node)) return "BinaryExpression";
  if (ts.isConditionalExpression(node)) return "ConditionalExpression";
  if (ts.isTemplateExpression(node)) return "TemplateExpression";
  if (ts.isYieldExpression(node)) return "YieldExpression";
  if (ts.isSpreadElement(node)) return "SpreadElement";
  if (ts.isClassExpression(node)) return "ClassExpression";
  if (ts.isOmittedExpression(node)) return "OmittedExpression";
  if (ts.isExpressionWithTypeArguments(node))
    return "ExpressionWithTypeArguments";
  if (ts.isAsExpression(node)) return "AsExpression";
  if (ts.isSatisfiesExpression(node)) return "SatisfiesExpression";
  if (ts.isNonNullExpression(node)) return "NonNullExpression";
  if (ts.isMetaProperty(node)) return "MetaProperty";
  if (ts.isSyntheticExpression(node)) return "SyntheticExpression";
  if (ts.isPartiallyEmittedExpression(node))
    return "PartiallyEmittedExpression";
  if (ts.isCommaListExpression(node)) return "CommaListExpression";
  if (ts.isTemplateSpan(node)) return "TemplateSpan";
  if (ts.isSemicolonClassElement(node)) return "SemicolonClassElement";
  if (ts.isBlock(node)) return "Block";
  if (ts.isVariableStatement(node)) return "VariableStatement";
  if (ts.isEmptyStatement(node)) return "EmptyStatement";
  if (ts.isExpressionStatement(node)) return "ExpressionStatement";
  if (ts.isIfStatement(node)) return "IfStatement";
  if (ts.isDoStatement(node)) return "DoStatement";
  if (ts.isWhileStatement(node)) return "WhileStatement";
  if (ts.isForStatement(node)) return "ForStatement";
  if (ts.isForInStatement(node)) return "ForInStatement";
  if (ts.isForOfStatement(node)) return "ForOfStatement";
  if (ts.isContinueStatement(node)) return "ContinueStatement";
  if (ts.isBreakStatement(node)) return "BreakStatement";
  if (ts.isReturnStatement(node)) return "ReturnStatement";
  if (ts.isWithStatement(node)) return "WithStatement";
  if (ts.isSwitchStatement(node)) return "SwitchStatement";
  if (ts.isLabeledStatement(node)) return "LabeledStatement";
  if (ts.isThrowStatement(node)) return "ThrowStatement";
  if (ts.isTryStatement(node)) return "TryStatement";
  if (ts.isDebuggerStatement(node)) return "DebuggerStatement";
  if (ts.isVariableDeclaration(node)) return "VariableDeclaration";
  if (ts.isVariableDeclarationList(node)) return "VariableDeclarationList";
  if (ts.isFunctionDeclaration(node)) return "FunctionDeclaration";
  if (ts.isClassDeclaration(node)) return "ClassDeclaration";
  if (ts.isInterfaceDeclaration(node)) return "InterfaceDeclaration";
  if (ts.isTypeAliasDeclaration(node)) return "TypeAliasDeclaration";
  if (ts.isEnumDeclaration(node)) return "EnumDeclaration";
  if (ts.isModuleDeclaration(node)) return "ModuleDeclaration";
  if (ts.isModuleBlock(node)) return "ModuleBlock";
  if (ts.isCaseBlock(node)) return "CaseBlock";
  if (ts.isNamespaceExportDeclaration(node))
    return "NamespaceExportDeclaration";
  if (ts.isImportEqualsDeclaration(node)) return "ImportEqualsDeclaration";
  if (ts.isImportDeclaration(node)) return "ImportDeclaration";
  if (ts.isImportClause(node)) return "ImportClause";
  if (ts.isImportTypeAssertionContainer(node))
    return "ImportTypeAssertionContainer";
  if (ts.isAssertClause(node)) return "AssertClause";
  if (ts.isAssertEntry(node)) return "AssertEntry";
  if (ts.isNamespaceImport(node)) return "NamespaceImport";
  if (ts.isNamespaceExport(node)) return "NamespaceExport";
  if (ts.isNamedImports(node)) return "NamedImports";
  if (ts.isImportSpecifier(node)) return "ImportSpecifier";
  if (ts.isExportAssignment(node)) return "ExportAssignment";
  if (ts.isExportDeclaration(node)) return "ExportDeclaration";
  if (ts.isNamedExports(node)) return "NamedExports";
  if (ts.isExportSpecifier(node)) return "ExportSpecifier";
  if (ts.isMissingDeclaration(node)) return "MissingDeclaration";
  if (ts.isNotEmittedStatement(node)) return "NotEmittedStatement";
  if (ts.isExternalModuleReference(node)) return "ExternalModuleReference";
  if (ts.isJsxElement(node)) return "JsxElement";
  if (ts.isJsxSelfClosingElement(node)) return "JsxSelfClosingElement";
  if (ts.isJsxOpeningElement(node)) return "JsxOpeningElement";
  if (ts.isJsxClosingElement(node)) return "JsxClosingElement";
  if (ts.isJsxFragment(node)) return "JsxFragment";
  if (ts.isJsxOpeningFragment(node)) return "JsxOpeningFragment";
  if (ts.isJsxClosingFragment(node)) return "JsxClosingFragment";
  if (ts.isJsxAttribute(node)) return "JsxAttribute";
  if (ts.isJsxAttributes(node)) return "JsxAttributes";
  if (ts.isJsxSpreadAttribute(node)) return "JsxSpreadAttribute";
  if (ts.isJsxExpression(node)) return "JsxExpression";
  if (ts.isCaseClause(node)) return "CaseClause";
  if (ts.isDefaultClause(node)) return "DefaultClause";
  if (ts.isHeritageClause(node)) return "HeritageClause";
  if (ts.isCatchClause(node)) return "CatchClause";
  if (ts.isPropertyAssignment(node)) return "PropertyAssignment";
  if (ts.isShorthandPropertyAssignment(node))
    return "ShorthandPropertyAssignment";
  if (ts.isSpreadAssignment(node)) return "SpreadAssignment";
  if (ts.isEnumMember(node)) return "EnumMember";
  if (ts.isUnparsedPrepend(node)) return "UnparsedPrepend";
  if (ts.isSourceFile(node)) return "SourceFile";
  if (ts.isBundle(node)) return "Bundle";
  if (ts.isUnparsedSource(node)) return "UnparsedSource";
  return "Unknown";
};

export const recursiveDebugAST = (
  node: ts.Node,
  level: number,
  maxLevel: number
): void => {
  const levelstr = initArray(level, () => "-").join("");
  const type = determineType(node);

  // eslint-disable-next-line no-console
  console.log(
    `${levelstr} ${node.constructor.name}/${type}: ${node.getText()}`
  );
  if (level < maxLevel) {
    node
      .getChildren()
      .forEach((n) => recursiveDebugAST(n, level + 1, maxLevel));
  }
};

const extractParameterNodes = (node: ts.Node, level: number = 0): ts.Node[] => {
  const result: ts.Node[] = [];
  if (ts.isParameter(node)) {
    result.push(node);
  } else if (level < 2) {
    const deeperSearch = node
      .getChildren()
      .map((n) => extractParameterNodes(n, level + 1));
    for (const list of deeperSearch) {
      result.push(...list);
    }
  }
  return result;
};

interface ParameterData {
  name: string;
  type: string;
}

const extractParameter = (paramNode: ts.Node): ParameterData => {
  const children = paramNode.getChildren();
  // first identifier is name
  // then last node -> identifier is type, can assume text of that node for generics
  const identifiers = children.filter(
    (n) => n.constructor.name === "IdentifierObject"
  );
  const firstIdentifier = identifiers[0];

  const typeReferences = children.filter((n) => ts.isTypeReferenceNode(n));

  let typeTest = "";
  if (typeReferences.length > 0) {
    typeTest = typeReferences[0].getText().trim();
  } else {
    typeTest = children[children.length - 1].getText().trim();
  }

  return {
    name: firstIdentifier.getText(),
    type: typeTest,
  };
};

interface ConstructorData {
  visibility: "public" | "protected" | "private";
  params: ParameterData[];
}

export const extractConstructor = (
  constructorNode: ts.Node
): ConstructorData => {
  const params = extractParameterNodes(constructorNode);

  let visibility: "public" | "protected" | "private" = "public";
  const maybeVisibilityString = constructorNode.getChildAt(0).getText().trim();
  if (maybeVisibilityString.startsWith("private")) {
    visibility = "private";
  } else if (maybeVisibilityString.startsWith("protected")) {
    visibility = "protected";
  }

  return { visibility, params: params.map((param) => extractParameter(param)) };
};

interface ClassData {
  fqcn: string;
  name: string;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorVisibility: "public" | "protected" | "private";
  constructorParameters: ParameterData[];
}

export const isClassExported = (classNode: ts.Node): boolean => {
  const chd = classNode.getChildren();
  return chd.length > 0 && chd[0].getText() === "export";
};

export const extractClass = (
  baseDir: string,
  src: ts.SourceFile,
  classNode: ts.Node
): ClassData => {
  const children = classNode.getChildren();
  const identifiers = children.filter((n) => ts.isIdentifier(n));
  const name = identifiers[0].getText();

  const fqcn = `${path
    .relative(baseDir, src.fileName)
    .replace(/.ts$/, "")
    .replaceAll("\\", "/")}/${name}`;

  const implementsInterfaces: string[] = [];
  let extendsClass: string | null = null;
  const childWithHeritageClauses = children.find((n) =>
    n.getChildren().some((sn) => ts.isHeritageClause(sn))
  );
  if (childWithHeritageClauses) {
    const extendsClause = childWithHeritageClauses
      .getChildren()
      .find((n) => n.getText().startsWith("extends "));

    if (extendsClause) {
      extendsClass = extendsClause
        .getChildAt(extendsClause.getChildCount() - 1)
        .getText();
    }
    const implementsClause = childWithHeritageClauses
      .getChildren()
      .find((n) => n.getText().startsWith("implements "));
    if (implementsClause) {
      const subImplements = implementsClause.getChildAt(
        implementsClause.getChildCount() - 1
      );
      const interfaceTypesNodes = subImplements
        .getChildren()
        .filter((n) => ts.isExpressionWithTypeArguments(n));
      implementsInterfaces.push(
        ...interfaceTypesNodes.map((inter) => inter.getChildAt(0).getText())
      );
    }
  }
  const subChildren = children.map((c) => c.getChildren()).flat(1);
  const childConstructor = subChildren.find((n) =>
    ts.isConstructorDeclaration(n)
  );

  // by default is public even if is not specified
  let constructorVisibility: "public" | "protected" | "private" = "public";
  const constructorParameters: ParameterData[] = [];
  if (childConstructor) {
    const constructorData = extractConstructor(childConstructor);
    constructorParameters.push(...constructorData.params);
    constructorVisibility = constructorData.visibility;
  }

  // eslint-disable-next-line no-console
  console.log(`Found class ${fqcn}`);

  return {
    fqcn,
    name,
    extendsClass,
    implementsInterfaces,
    constructorParameters,
    constructorVisibility,
  };
};

const formatAndSave = async (
  baseDir: string,
  outFile: string,
  classes: ClassData[]
): Promise<void> => {
  const jsons = classes.map((c) => {
    const path = c.fqcn.replace(new RegExp("/" + c.name + "$"), "");
    const importStr = `new Promise((r) => void import("./${path}").then((imp) => r(imp.${c.name})))`;
    return `{
      fqcn: "${c.fqcn}",
      name: "${c.name}",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ctor: ${c.constructorVisibility === "public" ? importStr : "null"},
      implementsInterfaces: ${JSON.stringify(c.implementsInterfaces)},
      extendsClass: ${c.extendsClass ? `"${c.extendsClass}"` : "null"},
      constructorVisibility: "${c.constructorVisibility}",
      constructorParameters: ${JSON.stringify(c.constructorParameters)},
    }`;
  });
  const json = `[${jsons.join(",")}]`;

  const dataType = `
    export interface ParameterData {
      name: string;
      type: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Constructor = new (...args: any[]) => any;
    export interface ClassData {
      fqcn: string;
      name: string;
      ctor: Promise<Constructor> | null;
      implementsInterfaces: string[];
      extendsClass: string | null;
      constructorParameters: ParameterData[];
      constructorVisibility: "public" | "protected" | "private";
    }`;

  const warning =
    "// This file was autogenerated by aero-di. It is recommended to not change it";

  const contents = `${warning}\n${dataType}\n export const classesReflection: ClassData[] = ${json};`;

  const outPath = `${baseDir}/${outFile}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const prettierConfigOptions = await prettier.resolveConfig(outPath);

  if (prettierConfigOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    prettierConfigOptions.parser = "typescript";
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const formatted = prettier.format(
    contents,
    prettierConfigOptions ?? {
      parser: "typescript",
    }
  );

  fs.writeFileSync(outPath, formatted);
};

async function generateReflectionData(
  baseDir: string,
  outFile: string,
  includeGlob: string,
  excludeGlob: string
): Promise<void> {
  const filesAll = await scan(baseDir);
  const files = filesAll
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => minimatch(file, includeGlob))
    .filter((file) => !minimatch(file, excludeGlob))
    .map((file) => "./" + path.relative(baseDir, file))
    .map((file) => file.replaceAll("\\", "/"));
  process.chdir(baseDir);
  const program = ts.createProgram(files, {});
  program.getTypeChecker();
  const sourceFiles = program.getSourceFiles();
  const classes: ClassData[] = [];
  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.fileName;
    if (
      !sourceFile.isDeclarationFile &&
      minimatch(filePath, includeGlob) &&
      !minimatch(filePath, excludeGlob)
    ) {
      // eslint-disable-next-line no-console
      console.log(`Analyzing file ${filePath}`);
      const visitor = (node: ts.Node): void => {
        if (ts.isClassDeclaration(node) && isClassExported(node)) {
          classes.push(extractClass(baseDir, sourceFile, node));
        }
        ts.forEachChild(node, visitor);
      };
      ts.forEachChild(sourceFile, visitor);
    }
  }
  await formatAndSave(baseDir, outFile, classes);
}

const options = {
  baseDir: {
    type: "string" as "string" | "boolean",
    short: "d",
  },
  outFile: {
    type: "string" as "string" | "boolean",
    short: "o",
  },
  includeGlob: {
    type: "string" as "string" | "boolean",
    short: "i",
  },
  excludeGlob: {
    type: "string" as "string" | "boolean",
    short: "e",
  },
};

let baseDir = "";
let outFile = "";
let includeGlob = "";
let excludeGlob = "";

try {
  const { values } = parseArgs({
    options,
  });
  baseDir = path.resolve(values.baseDir as string);
  outFile = values.outFile as string;
  includeGlob = values.includeGlob as string;
  excludeGlob = values.excludeGlob as string;
  if (!baseDir) {
    throw new Error(`Base directory argument missing`);
  }
  if (!outFile) {
    throw new Error(`Out file argument missing`);
  }
  if (!includeGlob) {
    throw new Error(`Include glob matcher argument missing`);
  }
  if (!excludeGlob) {
    throw new Error(`Exclude glob matcher argument missing`);
  }
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Base directory ${baseDir} does not exist`);
  }
  // eslint-disable-next-line no-console
  console.log({
    baseDir,
    outFile,
    includeGlob,
    excludeGlob,
  });
  void generateReflectionData(baseDir, outFile, includeGlob, excludeGlob);
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line no-console
  console.error(e.message);
  // eslint-disable-next-line no-console
  console.log(
    `Usage example: aero-gen --baseDir=/home/code --outFile=generated.ts --includeGlob="**/*.spec.ts" --excludeGlob="**/*.spec.ts"`
  );
  process.exit(1);
}
