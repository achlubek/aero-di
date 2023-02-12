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

async function main(): Promise<void> {
  const di = new DI();
  di.registerValue("testing", someValue);
  await di.registerByFqcnGlob("**/*");

  const testResolved =
    di.wireInterface<TestClassInterface>("TestClassInterface");

  const logger = di.wireInterface<LoggerInterface>("LoggerInterface");

  logger.info(main, JSON.stringify(testResolved, undefined, 2));
}

void main();
