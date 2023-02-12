export interface ParameterData {
  name: string;
  type: string;
}
export interface ClassData {
  fqcn: string;
  name: string;
  implementsInterfaces: string[];
  extendsClass: string | null;
  constructorParameters: ParameterData[];
}

export const classesReflection: ClassData[] = [
  {
    "fqcn": "src/DI/DI",
    "name": "DI",
    "extendsClass": null,
    "implementsInterfaces": [],
    "constructorParameters": []
  },
  {
    "fqcn": "src/infrastructure/configuration/Configuration/Configuration",
    "name": "Configuration",
    "extendsClass": null,
    "implementsInterfaces": [
      "ConfigurationInterface"
    ],
    "constructorParameters": []
  },
  {
    "fqcn": "src/infrastructure/logger/Logger/InvalidLogLevelException",
    "name": "InvalidLogLevelException",
    "extendsClass": "Error",
    "implementsInterfaces": [],
    "constructorParameters": []
  },
  {
    "fqcn": "src/infrastructure/logger/Logger/Logger",
    "name": "Logger",
    "extendsClass": null,
    "implementsInterfaces": [
      "LoggerInterface"
    ],
    "constructorParameters": [
      {
        "name": "config",
        "type": "ConfigurationInterface"
      }
    ]
  },
  {
    "fqcn": "src/main/TestClass",
    "name": "TestClass",
    "extendsClass": null,
    "implementsInterfaces": [
      "TestClassInterface"
    ],
    "constructorParameters": [
      {
        "name": "logger",
        "type": "LoggerInterface"
      },
      {
        "name": "config",
        "type": "ConfigurationInterface"
      },
      {
        "name": "testing",
        "type": "public readonly"
      }
    ]
  }
];