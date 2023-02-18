class AeroDIException extends Error {
  public constructor(subjectName: string, message: string) {
    super(`AeroDI Error "${message}" on subject "${subjectName}"`);
  }
}

export class ClassConstructorNotPublicException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "Class constructor is not public");
  }
}

export class ClassIsAbstractException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "Class is abstract");
  }
}

export class MultipleInterfaceImplementationsFoundException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "Multiple interface implementations found");
  }
}

export class NoInterfaceImplementationsFoundException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "No interface implementations found");
  }
}

export class MultipleClassChildrenFoundException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "Multiple class children found");
  }
}

export class NoClassChildrenFoundException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "No class children found");
  }
}

export class ClassMetadataNotFoundException extends AeroDIException {
  public constructor(subjectName: string) {
    super(subjectName, "Class metadata not found");
  }
}

class AeroDICannotWireParameterException extends Error {
  public constructor(
    subjectName: string,
    parameterName: string,
    message: string
  ) {
    super(
      `AeroDI Error "${message}" on subject "${subjectName}" on parameter "${parameterName}"`
    );
  }
}

export class ParameterTypesIncompatibleException extends AeroDICannotWireParameterException {
  public constructor(
    subjectName: string,
    parameterName: string,
    expectedType: string,
    actualType: string,
    additionalInfo: string
  ) {
    super(
      subjectName,
      parameterName,
      `Expected type ${expectedType} but got ${actualType}, ${additionalInfo}`
    );
  }
}

export class ValueForParameterNotFoundException extends AeroDICannotWireParameterException {
  public constructor(subjectName: string, parameterName: string) {
    super(subjectName, parameterName, `Cannot find a suitable value`);
  }
}

class AeroDICannotWireParameterTypeException extends Error {
  public constructor(
    subjectName: string,
    parameterName: string,
    parameterTypeName: string,
    message: string
  ) {
    super(
      `AeroDI Error "${message}" on subject "${subjectName}" on parameter "${parameterName} of type ${parameterTypeName}"`
    );
  }
}

export class ParameterTypeMultipleInterfaceImplementationsFoundException extends AeroDICannotWireParameterTypeException {
  public constructor(
    subjectName: string,
    parameterName: string,
    parameterTypeName: string
  ) {
    super(
      subjectName,
      parameterName,
      parameterTypeName,
      "Multiple interface implementations found"
    );
  }
}

export class ParameterTypeMultipleClassChildrenFoundException extends AeroDICannotWireParameterTypeException {
  public constructor(
    subjectName: string,
    parameterName: string,
    parameterTypeName: string
  ) {
    super(
      subjectName,
      parameterName,
      parameterTypeName,
      "Multiple class children found"
    );
  }
}
