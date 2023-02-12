interface MyInterface {
  name: string;
}
interface MyOtherInterface {
  name: string;
}

class Dupa {}

export abstract class MyClass
  extends Dupa
  implements /*fuck*/ MyInterface, MyOtherInterface
{
  public name = "heh";
  public constructor(
    private readonly interestingService: MyInterface,
    otherInterestingService: MyOtherInterface
  ) {
    super();
    this.interestingService.name.toString();
    otherInterestingService.name.toString();
  }
}
