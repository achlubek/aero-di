// eslint-disable-next-line no-restricted-imports
import { ClassData, classesReflection } from "@app/classesReflection";

export const getClassesImplementingInterface = (
  interfaceName: string
): ClassData[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return classesReflection.filter((c) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    c.implementsInterfaces.some((ci) => ci === interfaceName)
  );
};

export const getClassMetadata = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classConstructor: new (...args: any[]) => any
): ClassData | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return classesReflection.find((c) => c.name === classConstructor.name);
};

export const getInstanceMetadata = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: object
): ClassData | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return classesReflection.find((c) => c.name === obj.constructor.name);
};
