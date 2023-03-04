export class MyClass {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  public constructor() {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  public publicField: string;
  public publicFieldWithInitializer = "test";
  public publicExclaimation!: number;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line
  noVisibility: Object;
  // eslint-disable-next-line
  noVisibilityAssignWithType: Object = {};

  public myMethod(): void {
    // eslint-disable-next-line no-console
    console.log(1);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private weirdMethod(asdbasd: string, dfgdfg: number): { type: string } {
    String();
  }
}
