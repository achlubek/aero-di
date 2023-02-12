import { ConfigurationInterface } from "@app/infrastructure/configuration/ConfigurationInterface";
import { loadRequiredString } from "@app/infrastructure/configuration/envLoadingUtils";
import {
  LogLevel,
  availableLogLevels,
} from "@app/infrastructure/logger/LoggerInterface";

export class Configuration implements ConfigurationInterface {
  private readonly logLevel: LogLevel;

  public constructor() {
    const parsedLogLevel = loadRequiredString("LOG_LEVEL");
    if (!availableLogLevels.includes(parsedLogLevel)) {
      throw new Error(`"LOG_LEVEL" env var is not a valid log level`);
    }
    this.logLevel = parsedLogLevel;
  }

  public getLogLevel(): LogLevel {
    return this.logLevel;
  }
}
