import { DI } from "@app/DI";
import { ConfigurationInterface } from "@app/infrastructure/configuration/ConfigurationInterface";
import { LoggerInterface } from "@app/infrastructure/logger/LoggerInterface";

interface TestClassInterface {
  logger: LoggerInterface;
  config: ConfigurationInterface;
  testing: string;
}

const someValue = "test123";

export class TestClass implements TestClassInterface {
  public constructor(
    public readonly logger: LoggerInterface,
    public readonly config: ConfigurationInterface,
    public readonly testing: string
  ) {}
}

const di = new DI();
di.registerValue("testing", someValue);
di.registerByFqcnGlob("src/**/*").then(() => {
  const testResolved =
    di.wireInterface<TestClassInterface>("TestClassInterface");

  // eslint-disable-next-line no-console
  console.log(testResolved);
});
