export interface MyInterface {
  field1: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  field2: Object;
  method1(): void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  method2(test: string, test2: Object): void;
  method3(
    test: string,
    test2: { ufo: number; ouch: string }
  ): { kek: string; bob: number };
}
