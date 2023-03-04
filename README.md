# Dependency Injection for Typescript
Automatic, no decorators, dependency injection library for your Typescript project.

## Key features
- No decorators - completely no decorators whatsoever!
- Transparent - no changes to your code
- Automatically finds suitable implementation for interfaces by name
- Automatically finds suitable class based on a parent class
- Autowires everything, just like in Symfony or Spring
- Works just as fine when compiled
- As a bonus - exposes class and interface reflection data

## Installation
To install, if you use npm:
```
npm install aero-di
```
If you use yarn:
```
yarn add aero-di
```

## Usage
First, you want to generate reflection data for your code.
There is an included command that will do that for you.
It would be best to put it into `package.json` `scripts` section, like that:
```json
"generate-reflection": "aero-di-generate --baseDir src",
```
This command will scan the `src` directory and save reflection data to `reflectionData.ts` in that directory.

**Hint**: Generation command offers more options, explained in a section below.

You can now run this command. If you use npm, use:
```
npm run generate-reflection
```
If you use yarn:
```
yarn generate-reflection
```

**Hint:** It would be best to regenerate reflection with every build, so run it along your build, before running the typescript compiler.

After running this command, reflection data is ready. 
This is a normal source file that you can import and use as well, just don't edit it!

Now, to create your dependency injection container, import the library:
```ts
import { AeroDI } from "aero-di";
```
Import your generated reflection data as well, this can look like that:
```ts
import { classesReflection } from "./reflection";
```

Now initialize the container
```ts
const di = new AeroDI(classesReflection);
```

And that's it! You can now get an instance of a class:
```ts
const myInstance = await di.getByClass(MyClass);
```
You can also get an instance for an interface:
```ts
const myInstance = await di.getByInterface<ServiceInterface>("ServiceInterface");
```

## Reflection command detailed usage
Available options (shortcut provided in parentheses):
* --baseDir (-b) - base directory to recursively search for source files
* --outFile (-o) - default: `reflectionData.ts` - file name to save reflection data to - it will be stored in baseDir
* --includeGlob (-i) - default: `**/*.ts` - glob for matching files, only files passing this glob will be analyzed
* --excludeGlob (-e) - default: `**/*.spec.ts` - glob for excluding files, files matched by this glob will not be analyzed
* --verbose (-v) - default: `false` -  if used, information about analysis process will be printed

The file that is generated is not intended to be changed, but feel free to use it!

Example usage:
```
aero-di-generate --baseDir=src --outFile=gen.ts --includeGlob="**/*.ts" --excludeGlob="**/*.spec.ts"
aero-di-generate -b=src
```

## Advanced usage
Of course the library must be able to handle a really challenging DI situations.

Here is explained how to tackle most of them:

### Reflection data
To work, reflection data is a must, and the mechanism to support it is completely new.
It does not use reflect-metadata or design stuff, but uses Typescript compiler api to
read your code base and save what it reads to a typescript file.
This also allows you to use this code like any other source file.

You can get the reflection data for objects, classes and class names from the DI as 
well, which is more handy, but nothing prevents you from using the reflection file directly.

Reflection saved in the file is basically an array of objects with following interface:
```ts
// For Classes:
  fqcn: string; // Fully qualified class name - path and name
  name: string; // Class name
  ctor: Promise<Constructor> | null; // Constructor for that the class - null if not public
  implementsInterfaces: string[]; // Interfaces implemented by the class
  extendsClass: string | null; // Parent of the class - null if not extending
  constructorParameters: ParameterData[]; // Array of constructor parameters, with name and type fields
  constructorVisibility: "public" | "protected" | "private"; // Constructor visibility
  isAbstract: boolean; // Is the class abstract or not
  properties: PropertyData[]; // Class properties
  methods: MethodData[]; // Class methods
// For Interfaces:
  fqin: string; // Fully qualified interface name - path and name
  name: string; // Interface name
  properties: PropertyData[]; // Interface propreties
  extendsInterface: string | null; // Parent of the interface - null if not extending
  methods: MethodData[]; // Interface methods
```
Using this you can, for example, create an instance of a class by name, 
which is useful, for example, when recreating events from the database

FQCN is also very useful to distinguish 2 different classes with the same name

### Get the DI injected itself in a class
AeroDI will register itself in the container when initialized.
This means that getting it's instance in a class is as simple as using it in the container:
```ts
public constructor(
  private readonly di: AeroDI
)
```

### Register already existing instance into the DI
At times your will have an instance and want the DI to see it, this is very simple as well.
If you want to register it via the class name, use the following:
```ts
di.registerInstance(myInstance);
```
If you want to register it for a particular type name (class, or interface), you can do this:
```ts
di.registerInstanceForTypeName("MyInstanceInterface", MyInstance)
```

**Hint**: Remember, if the class that you are registering is in the directory
scanned by the reflection generator, this is not needed!

### Read class reflection
You can get class reflection data using an instance, a string of the class name, or a parent class name:

```ts
const metadataByInstance = di.classMetadataProvider.getByInterface("MyInterface");
const metadataByClassName = di.classMetadataProvider.getByClassName("MyClass");
const metadataByParentClass = di.classMetadataProvider.getByParentClassNameWithRoot("MyBaseClass");
```

### Get classes implementing an interface
You can get class reflection data of classes implementing an interface like that:
```ts
const metadatas = di.classMetadataProvider.getByInterface("MyInterface");
```

### Get a class hierarchy tree, based on extends
You can get class reflection data of classes in a class hierarchy tree, based on extends like that:
```ts
const withRootClass = di.classMetadataProvider.getByParentClassNameWithRoot("MyBaseClass");
const withoutRootClass = di.classMetadataProvider.getByParentClassNameWithoutRoot("MyBaseClass");
```

### Register a global parameter
You can set up a global parameter that will be always injected if a parameter name is the same in any class constructor
```ts
di.parameterResolver.registerValueForParameterName("hostname", "127.0.0.1");
```

### Register a scoped parameter
You can also set up a parameter that works like the global one, but only for one class.
You can do it by class name or class constructor
```ts
di.parameterResolver.registerValueForClassAndParameterName(MyInstance, "hostname", "127.0.0.1");
di.parameterResolver.registerValueForClassNameAndParameterName("MyInstance", "hostname", "127.0.0.1");
```

### Create multiple containers
There is no problem with having multiple DI instances at the same time, like that:
```ts
const commonData = classesReflection.filter(
    c => !c.name.endsWith("Handler") && !c.name.endsWith("Service"))
const handlersData = classesReflection.filter(c => c.name.endsWith("Handler"))
const servicesData = classesReflection.filter(c => c.name.endsWith("Service"))

const handlersDI = new AeroDI([...commonData, ...handlersData]);
const servicesDI = new AeroDI([...commonData, ...servicesData]);
```

### Parameter resolving precedence
Value for a parameter in a constructor is resolved in the following order:
- Check for a scoped parameter - if found then use it
- Check for a global parameter - if found then use it
- Check for classes implementing used interface - if found then autowire and use it
- Check for classes by type - if found then autowire and use it
- Check for classes by parent tree - if found then autowire and use it

If an instance for a class or interface was already initialized once
it is cached and used again. 
Eager loading can be accomplished by wiring desired classes just after DI was initialized.
Support for transient instances is planned in the future.


