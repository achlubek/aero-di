import { scan } from "fast-scan-dir-recursive";
import minimatch from "minimatch";
import * as path from "path";

import { formatAndSave } from "@app/reflection/formatAndSave";
import { generateReflectionDataForFiles } from "@app/reflection/generateReflection";

export const run = async (options: {
  baseDir: string;
  includeGlob: string;
  excludeGlob: string;
  outFile: string;
  verbose: boolean;
}): Promise<void> => {
  const filesAll = await scan(options.baseDir);
  const files = filesAll
    .map((file) => path.relative(options.baseDir, file))
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => minimatch(file, options.includeGlob))
    .filter((file) => !minimatch(file, options.excludeGlob))
    .map((file) => path.resolve(path.join(options.baseDir, file)));

  const classesData = generateReflectionDataForFiles(options.baseDir, files, {
    verbose: options.verbose,
  });
  await formatAndSave(options.baseDir, options.outFile, classesData);
  // eslint-disable-next-line no-console
  console.log(`Done! Saved data for ${classesData.length} classes`);
};
