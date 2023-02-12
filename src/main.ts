import { DI } from "@app/DI";
import { classesReflection } from "@app/classesReflection";
import { ConfigurationInterface } from "@app/infrastructure/configuration/ConfigurationInterface";
import { Logger } from "@app/infrastructure/logger/Logger";
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
  const di = new DI(classesReflection);
  di.registerValue("testing", someValue);
  await di.registerByFqcnGlob("**/*");

  const testResolved = await di.wireInterface<TestClassInterface>(
    "TestClassInterface"
  );

  const logger = await di.wireClass(Logger);

  logger.info(main, JSON.stringify(testResolved, undefined, 2));
}

void main();
