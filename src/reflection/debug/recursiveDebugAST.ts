import * as ts from "typescript";

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
