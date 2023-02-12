import { LogLevel } from "@app/infrastructure/logger/LoggerInterface";

export interface ConfigurationInterface {
  getLogLevel(): LogLevel;
}
