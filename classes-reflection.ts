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
    "fqcn": "src/main/Dupa",
    "name": "Dupa",
    "extendsClass": null,
    "implementsInterfaces": [],
    "constructorParameters": []
  },
  {
    "fqcn": "src/main/MyClass",
    "name": "MyClass",
    "extendsClass": "Dupa",
    "implementsInterfaces": [
      "MyInterface",
      "MyOtherInterface"
    ],
    "constructorParameters": [
      {
        "name": "interestingService",
        "type": "MyInterface"
      },
      {
        "name": "otherInterestingService",
        "type": "MyOtherInterface"
      }
    ]
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
        "name": "level",
        "type": "LogLevel"
      }
    ]
  }
];