import path from 'node:path';
import fs from 'node:fs';
import minimist from 'minimist';
import yaml from 'yaml';

import { createEngine } from './engine.js';
import { ensureFileSync, getScriptPath, resolvePath } from './utility.js';

const HELP_MESSAGE = `
Usage: resumegen <yaml> [options]

Options:
  -o, --output <path>               Output file
                                    (DEFAULT: the same as the input file with .html extension)
  -t, --template <path>             Template file
                                    (DEFAULT: the built-in default template)

  --template-component-dir <name>   Directory for the template components
                                    (DEFAULT: partials)
  --template-extension <ext>        File extension for the template files
                                    (DEFAULT: .eta)

  -h, --help                        Show this message
  --dry                             Print the build result without writing to file
`;

function printHelp() {
  console.log(HELP_MESSAGE.trim());
}

function getBuiltinTemplatePath() {
  return resolvePath(path.join(getScriptPath(), 'templates', 'default.eta'));
}

function getInputData(inputPath: string) {
  const resolvedInputPath = resolvePath(inputPath);
  if (!fs.existsSync(resolvedInputPath)) {
    throw new Error(`Input file not found: ${resolvedInputPath}`);
  }
  const rawContent = fs.readFileSync(resolvedInputPath, 'utf-8');
  return yaml.parse(rawContent);
}

function getOutputPath(inputPath: string, outputPath?: string) {
  if (outputPath) {
    // EXAMPLE: ./example && ./example.html
    if (outputPath.indexOf(path.sep) !== -1) {
      const resolvedOutputPath = resolvePath(outputPath);
      const parsed = path.parse(resolvedOutputPath);
      if (parsed.ext === '') {
        return path.join(parsed.dir, parsed.name + '.html');
      }
      return resolvedOutputPath;
    }

    const parsedInput = path.parse(inputPath);
    // EXAMPLE: another-name-with-different-ext.html
    if (outputPath.indexOf('.') !== -1) {
      return path.join(parsedInput.dir, outputPath);
    }

    // EXAMPLE: only-a-name
    return path.join(parsedInput.dir, outputPath + '.html');
  }

  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, parsedPath.name + '.html');
}

async function main(args: string[]): Promise<never> {
  const parsedArgs = minimist(args, {
    alias: {
      o: 'output',
      t: 'template',
      h: 'help',
    },
    boolean: ['dry', 'help'],
    default: {
      template: getBuiltinTemplatePath(),
      ['template-component-dir']: 'partials',
      ['template-extension']: '.eta',
    }
  });

  if (parsedArgs._.length !== 1 || parsedArgs['help']) {
    printHelp();
    process.exit(0);
  }

  const inputPath = resolvePath(parsedArgs._[0]);
  const outputPath = getOutputPath(inputPath, parsedArgs['output']);

  const data = getInputData(inputPath);
  const engine = createEngine(parsedArgs['template'], {
    componentDir: parsedArgs['template-component-dir'],
    extension: parsedArgs['template-extension'],
  });
  const rendered = engine.render(data);

  if (parsedArgs['dry']) {
    console.log(rendered);
    process.exit(0);
  }

  ensureFileSync(outputPath, rendered);
  process.exit(0);
}

await main(process.argv.slice(2));
