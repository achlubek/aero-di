export class MyClass {
  public constructor() {}

  public publicField: string;
  public publicFieldWithInitializer = "test";
  public publicExclaimation!: number;

  noVisibility: Object;
  noVisibilityAssignWithType: Object = {};

  public myMethod(): void {
    console.log(1);
  }

  private weirdMethod(asdbasd: string, dfgdfg: number): { type: string } {
    new String();
  }
}
