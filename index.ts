import * as Yaml from 'https://deno.land/std@0.177.0/encoding/yaml.ts';
import * as Eta from 'https://deno.land/x/eta@v2.0.0/mod.ts';
import { parse } from 'https://deno.land/std@0.177.0/flags/mod.ts';
import { posix, win32 } from 'https://deno.land/std@0.177.0/path/mod.ts';
import { ensureFileSync, expandGlobSync } from 'https://deno.land/std@0.177.0/fs/mod.ts';

const HELP_INFO = `
resumegen.ts <yaml> [options]

OPTIONS:
  --template, -t <path>           specify the template to generate resume
                                  (DEFAULT: default.eta)
  --output, -o <path>             specify the output file basename.
                                  (DEFAULT: same with the input yaml file)
  --dry, -D                       dry run, do not write to file

CUSTOMIZE TEMPLATE:
  resumegen uses \`eta\` as its template engine. you can lern it at
  https://eta.js.org/.
`;

const OS_TYPE = Deno.build.os === 'windows' ? 'win32' : 'posix';
const PathModule = OS_TYPE === 'win32' ? win32 : posix;

const RUNTIME_PATH = PathModule.parse(PathModule.fromFileUrl(import.meta.url)).dir;

/**
 * Expand `~` to user home directory;
 * resolve relative path to absolute path.
 */
function expandPath(path?: string): string | undefined {
  if (typeof path === 'undefined' || path.length === 0) {
    return path;
  }
  if (path[0] === '~') {
    const userHome = OS_TYPE === 'posix' ? Deno.env.get('HOME') : Deno.env.get('USERPROFILE');
    path = path.replace(path[0], userHome!);
  }
  return PathModule.resolve(path);
}

/**
 * Load partials from the path of template directory.
 *
 * **NOTE: THIS FUNCTION HAS SIDE EFFECT**
 */
function loadPartials(path: string): void {
  const partialsPath = PathModule.join(RUNTIME_PATH === path ? PathModule.join(path, '/default') : path, '/partials');
  for (const file of expandGlobSync('*.eta', { root: partialsPath })) {
    const partialName = PathModule.parse(file.path).name;
    const partialContent = Deno.readTextFileSync(file.path);
    Eta.templates.define(partialName, Eta.compile(partialContent));
  }
}

/**
 * Entry Point
 */
async function main(args: string[]) {
  const parsedArgs = parse(args);
  if (parsedArgs._.length === 0) {
    console.log(HELP_INFO.trim());
    return;
  }

  const templateFilePath = expandPath(parsedArgs['template'] ?? parsedArgs['t'] ?? RUNTIME_PATH + '/default.eta');
  const templateParsedPath = PathModule.parse(templateFilePath!);
  loadPartials(PathModule.join(templateParsedPath.dir, templateParsedPath.name));

  const resumeYamlFilePath = parsedArgs._[0] as string;

  const outputName = parsedArgs['output'] ?? parsedArgs['o'] ?? PathModule.parse(resumeYamlFilePath).name;
  const outputHtmlFilePath = `${outputName}.html`;
  try {
    const yamlContent = Deno.readTextFileSync(resumeYamlFilePath);
    const yamlData = Yaml.parse(yamlContent) as Record<string, unknown>;

    const outputContent = (await Eta.renderFileAsync(templateFilePath!, yamlData)).split('\n').map(ln => ln.trim()).join('');

    if (parsedArgs['dry'] || parsedArgs['D']) {
      return;
    }

    ensureFileSync(outputHtmlFilePath);
    Deno.writeTextFileSync(outputHtmlFilePath, outputContent);
  }
  catch(error) {
    const logError = (msg: string) => console.error(`%c${msg}`, 'color:red');
    logError(error);
    logError(error?.message ?? 'unhandled error type');
    if (typeof error.stack !== 'undefined') {
      logError(error.stack);
    }
  }
}

await main(Deno.args);
