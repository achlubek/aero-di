// eslint-disable-next-line no-restricted-imports
import { ClassData, classesReflection } from "../classes-reflection";

export const getClassesImplementingInterface = (
  interfaceName: string
): ClassData[] => {
  return classesReflection.filter((c) =>
    c.implementsInterfaces.some((ci) => ci === interfaceName)
  );
};

export const getClassMetadata = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classConstructor: new (...args: any[]) => any
): ClassData | undefined => {
  return classesReflection.find((c) => c.name === classConstructor.name);
};

export const getInstanceMetadata = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: object
): ClassData | undefined => {
  return classesReflection.find((c) => c.name === obj.constructor.name);
};
