export interface MyInterface {
  field1: string;
  field2: Object;
  method1(): void;
  method2(test: string, test2: Object): void;
  method3(
    test: string,
    test2: { ufo: number; ouch: string }
  ): { kek: string; bob: number };
}
