import { DI } from "@app/DI";
import { Configuration } from "@app/infrastructure/configuration/Configuration";
import { ConfigurationInterface } from "@app/infrastructure/configuration/ConfigurationInterface";
import { Logger } from "@app/infrastructure/logger/Logger";
import { LoggerInterface } from "@app/infrastructure/logger/LoggerInterface";

interface TestClassInterface {
  logger: LoggerInterface;
  config: ConfigurationInterface;
  testing: string;
}

const someValue = "test123";

class TestClass implements TestClassInterface {
  public constructor(
    public readonly logger: LoggerInterface,
    public readonly config: ConfigurationInterface,
    public readonly testing: string
  ) {}
}

const di = new DI();
di.registerValue("testing", someValue);
di.register(TestClass);
di.register(Configuration);
di.register(Logger);

const testResolved = di.wireInterface<TestClassInterface>("TestClassInterface");

console.log(testResolved);
