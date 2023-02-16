#!/usr/bin/env node
import { scan } from "fast-scan-dir-recursive";
import * as fs from "fs";
import minimatch from "minimatch";
import * as path from "path";
import * as process from "process";
import { parseArgs } from "util";

import { formatAndSave } from "@app/reflection/formatAndSave";
import { generateReflectionDataForFiles } from "@app/reflection/generateReflection";

const options = {
  baseDir: {
    type: "string" as "string" | "boolean",
    short: "b",
  },
  outFile: {
    type: "string" as "string" | "boolean",
    short: "o",
    default: "reflectionData.ts",
  },
  includeGlob: {
    type: "string" as "string" | "boolean",
    short: "i",
    default: "**/*.ts",
  },
  excludeGlob: {
    type: "string" as "string" | "boolean",
    short: "e",
    default: "**/*.spec.ts",
  },
  verbose: {
    type: "boolean" as "string" | "boolean",
    short: "v",
    default: false,
  },
};

const helpMessage = `Usage help for Aero-DI reflection generation tool:
Available options (shortcut provided in parentheses):

--baseDir (-b) - base directory to recursively search for source files
--outFile (-o) - default: reflectionData.ts - file name to save reflection data to - it will be stored in baseDir
--includeGlob (-i) - default: **/*.ts - glob for matching files, only files passing this glob will be analyzed
--excludeGlob (-e) - default: **/*.spec.ts - glob for excluding files, files matched by this glob will not be analyzed
--verbose (-v) - default: false -  if used, information about analysis process will be printed

The file that is generated is not intended to be changed, but feel free to use it!

Example usage:
aero-di-generate --baseDir=src --outFile=gen.ts --includeGlob="**/*.ts" --excludeGlob="**/*.spec.ts"
aero-di-generate -b=src
`;

try {
  const { values } = parseArgs({
    options,
  });
  const baseDir = path.resolve(values.baseDir as string);
  const outFile = values.outFile as string;
  const includeGlob = values.includeGlob as string;
  const excludeGlob = values.excludeGlob as string;
  const verbose = values.verbose as boolean;
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Base directory ${baseDir} does not exist`);
  }
  process.chdir(baseDir);
  // eslint-disable-next-line no-console
  console.log(`Generating reflection to ${outFile} for directory ${baseDir}`);

  const run = async (): Promise<void> => {
    const filesAll = await scan(baseDir);
    const files = filesAll
      .map((file) => file.replaceAll("\\", "/"))
      .filter((file) => minimatch(file, includeGlob))
      .filter((file) => !minimatch(file, excludeGlob))
      .map((file) => "./" + path.relative(baseDir, file).replaceAll("\\", "/"));
    const classesData = generateReflectionDataForFiles(baseDir, files, { verbose });
    await formatAndSave(baseDir, outFile, classesData);
    // eslint-disable-next-line no-console
    console.log(`Done! Saved data for ${classesData.length} classes`);
  };

  void run();
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line no-console
  console.error(e.message);
  // eslint-disable-next-line no-console
  console.log(helpMessage);
  process.exit(1);
}
