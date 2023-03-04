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
  ignoreDuplicates: boolean;
}): Promise<void> => {
  const filesAll = await scan(options.baseDir);
  const files = filesAll
    .map((file) => path.relative(options.baseDir, file))
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => minimatch(file, options.includeGlob))
    .filter((file) => !minimatch(file, options.excludeGlob))
    .map((file) => path.resolve(path.join(options.baseDir, file)));

  const data = generateReflectionDataForFiles(options.baseDir, files, {
    verbose: options.verbose,
    ignoreDuplicates: options.ignoreDuplicates,
  });
  await formatAndSave(
    options.baseDir,
    options.outFile,
    data.classes,
    data.interfaces
  );
  // eslint-disable-next-line no-console
  console.log(`Saved data for ${data.classes.length} classes`);
  // eslint-disable-next-line no-console
  console.log(`Saved data for ${data.interfaces.length} interfaces`);
};
