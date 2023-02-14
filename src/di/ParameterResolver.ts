import { AeroDI } from "@app/di/AeroDI";
import { MetadataProvider } from "@app/di/MetadataProvider";
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
      const paramObjMetadata =
        this.metadataProvider.getMetadataByInstance(paramObj);
      if (paramObjMetadata) {
        const implementsInterface = paramObjMetadata.implementsInterfaces.some(
          (inter) => inter === expectedParamType
        );
        const isOfType = paramObj.constructor.name === expectedParamType;
        if (!isOfType && !implementsInterface) {
          throw new Error(
            `Cannot wire parameter ${parameterName} of class ${className}: Incompatible types: expected ${expectedParamType} but got ${paramObj.constructor.name}`
          );
        }
      }
    } else {
      const paramTypeof = typeof actualParamValue;
      if (paramTypeof !== expectedParamType) {
        throw new Error(
          `Cannot wire parameter ${parameterName} of class ${className}: Incompatible types: expected ${expectedParamType} but got ${paramTypeof}`
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
    const implementing = this.metadataProvider.getMetadataByInterface(
      param.type
    );
    if (implementing.length > 0) {
      return await this.di.getByClassData(implementing[0]);
    }

    // Check by class
    const being = this.metadataProvider.getMetadataByClassName(param.type);
    if (being) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.di.getByClassData(being);
    }

    throw new Error(
      `Cannot wire parameter ${param.name} of class ${classData.name}`
    );
  }
}
