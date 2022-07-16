import {
  I18nStringsFiles,
  I18nStringsWithCommentEntry,
  readFileAsync,
  writeFileAsync,
} from 'apple-strings';

import yargs from 'yargs';

const main = async () => {
  const argv = await yargs.options({
    input: {
      alias: 'i',
      type: 'array',
      requiresArg: true,
      description: 'Input file(s)',
    },
    output: {
      alias: 'o',
      type: 'string',
      requiresArg: true,
      description: 'Output file',
    },
    charset: {
      alias: 'c',
      type: 'string',
      requiresArg: false,
      default: 'UTF-16',
      description: 'Charset, default is UTF-16',
    },
    comment: {
      type: 'boolean',
      requiresArg: false,
      default: true,
      description: 'read and merge comments, default is true',
    },
  }).argv;

  const inputFiles = argv.input as string[];
  const outputFile = argv.output;
  const {charset, comment} = argv;

  if (!inputFiles || !inputFiles.length) {
    throw new Error('No input files specified');
  }

  if (inputFiles.length < 2) {
    throw new Error('At least two input files are required');
  }

  if (!outputFile) {
    throw new Error('No output file specified');
  }

  for (const inputFile of inputFiles) {
    if (typeof inputFile !== 'string') {
      throw new Error(`Invalid input file: ${inputFile}`);
    }
  }

  const stringFiles = await Promise.all(inputFiles.map((filePath) => {
    return readFileAsync(filePath, { encoding: charset, wantsComments: comment });
  }));

  const mergedStringFile: I18nStringsFiles = {};

  for (const stringFile of stringFiles) {
    for (const key in stringFile) {
      if (stringFile.hasOwnProperty(key)) {
        if (mergedStringFile.hasOwnProperty(key)) {
          const mergedEntry = mergedStringFile[key];
          const newEntry = stringFile[key];

          if (typeof mergedEntry !== 'string') {
            if (typeof newEntry !== 'string') {
              mergedEntry.comment = mergeComment(mergedEntry.comment, newEntry.comment);
            } else {
              // no-op
            }
            mergedStringFile[key] = mergedEntry;
          } else {
            mergedStringFile[key] = stringFile[key]
          }
        } else {
          mergedStringFile[key] = stringFile[key];
        }
      }
    }
  }

  const before = stringFiles.reduce((acc, cur) => acc + Object.keys(cur ?? {}).length, 0);
  console.log(`Before merge, ${before} entries`);
  console.log(`After merge, ${Object.keys(mergedStringFile).length} entries`);

  await writeFileAsync(outputFile, mergedStringFile, { encoding: charset, wantsComments: comment });

  console.log(`Merged to ${outputFile}`);
};

function mergeComment(comment1: string | undefined, comment2: string | undefined): string | undefined {
  if (comment1 && comment2) {
    return comment1 + '\n' + comment2;
  } else if (comment1) {
    return comment1;
  } else if (comment2) {
    return comment2;
  } else {
    return undefined;
  }
}

main();
