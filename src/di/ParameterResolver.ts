import { AeroDI } from "@app/di/AeroDI";
import { MetadataProvider } from "@app/di/MetadataProvider";
import {
  ParameterTypeMultipleClassChildrenFoundException,
  ParameterTypeMultipleInterfaceImplementationsFoundException,
  ParameterTypesIncompatibleException,
  ValueForParameterNotFoundException,
} from "@app/di/exceptions/AeroDIExceptions";
import {
  ClassData,
  ConstructorOf,
  ParameterData,
} from "@app/reflection/dataInterfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllowedParameterType = any;

export class ParameterResolver {
  public readonly registeredConstantValues: Record<
    string,
    AllowedParameterType
  > = {};

  public constructor(
    private readonly di: AeroDI,
    private readonly metadataProvider: MetadataProvider
  ) {}

  public registerValueForParameterName<T>(
    parameterName: string,
    value: T
  ): void {
    this.registeredConstantValues[parameterName] = value;
  }

  public registerValueForClassNameAndParameterName<T>(
    className: string,
    parameterName: string,
    value: T
  ): void {
    this.registerValueForParameterName(className + "/" + parameterName, value);
  }

  public registerValueForClassAndParameterName<C, T>(
    classCtor: ConstructorOf<C>,
    parameterName: string,
    value: T
  ): void {
    this.registerValueForParameterName(
      classCtor.name + "/" + parameterName,
      value
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async resolveParameters(classData: ClassData): Promise<any[]> {
    const paramsDefinitions = classData.constructorParameters;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await Promise.all(
      paramsDefinitions.map(async (param) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parameterValue =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await this.resolveParameter<any>(classData, param);

        this.checkTypeCorrectness(
          classData.name,
          param.name,
          param.type,
          parameterValue
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parameterValue;
      })
    );
  }

  private checkTypeCorrectness(
    className: string,
    parameterName: string,
    expectedParamType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualParamValue: any
  ): void {
    if (typeof actualParamValue === "object") {
      const paramObj = actualParamValue as object;
      const paramObjMetadata = this.metadataProvider.getByClassName(
        paramObj.constructor.name
      );
      if (paramObjMetadata) {
        const implementsInterface = paramObjMetadata.implementsInterfaces.some(
          (inter) => inter === expectedParamType
        );
        const isOfType = paramObj.constructor.name === expectedParamType;
        if (!isOfType && !implementsInterface) {
          throw new ParameterTypesIncompatibleException(
            className,
            parameterName,
            expectedParamType,
            paramObj.constructor.name
          );
        }
      }
    } else {
      const paramTypeof = typeof actualParamValue;
      if (paramTypeof !== expectedParamType) {
        throw new ParameterTypesIncompatibleException(
          className,
          parameterName,
          expectedParamType,
          paramTypeof
        );
      }
    }
  }

  public async resolveParameter<As>(
    classData: ClassData,
    param: ParameterData
  ): Promise<As> {
    // Find scoped parameter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const constScopedValue =
      this.registeredConstantValues[classData.name + "/" + param.name];
    if (constScopedValue) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return constScopedValue;
    }

    // Find global parameter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const constValue = this.registeredConstantValues[param.name];
    if (constValue) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return constValue;
    }

    // Check by interface
    const implementing = this.metadataProvider.getByInterface(param.type);
    if (implementing.length === 1) {
      return await this.di.getByClassData(implementing[0]);
    } else if (implementing.length > 1) {
      throw new ParameterTypeMultipleInterfaceImplementationsFoundException(
        classData.name,
        param.name,
        param.type
      );
    }

    // Check by class
    const being = this.metadataProvider.getByClassName(param.type);
    if (being) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.di.getByClassData(being);
    }

    // Check by extends class
    const extend = this.metadataProvider.getByParentClassName(param.type);
    if (extend.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.di.getByClassData(extend[0]);
    } else if (extend.length > 1) {
      throw new ParameterTypeMultipleClassChildrenFoundException(
        classData.name,
        param.name,
        param.type
      );
    }

    throw new ValueForParameterNotFoundException(param.name, classData.name);
  }
}
