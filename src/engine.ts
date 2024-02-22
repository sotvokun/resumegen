import * as path from 'node:path';
import * as fs from 'node:fs';
import { Eta } from 'eta';
import { globSync } from 'glob';
import { resolvePath } from './utility.js';

type EtaConfig = NonNullable<ConstructorParameters<typeof Eta>[0]>;
type EngineConfig = {
  componentDir: string,
  extension: string,
};

const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  componentDir: 'partials',
  extension: '.eta',
};

export function createEngine(
  templateEntryPoint: string,
  options: EngineConfig & EtaConfig = DEFAULT_ENGINE_CONFIG
) {
  const resolvedEntryPoint = resolvePath(templateEntryPoint);
  if (!fs.existsSync(resolvedEntryPoint)) {
    throw new Error(
      `[createEngine] Template entry point not found: ${resolvedEntryPoint}`
    );
  }

  const templatePath = path.parse(resolvePath(templateEntryPoint));
  const templateDir = path.join(templatePath.dir, templatePath.name);
  const templateFilePaths = globSync(`**/*${options.extension}`, {
    cwd: templateDir
  });

  const etaInstance = new Eta({
    views: templateDir,
    ...options,
  });

  const loadedTemplates: { components: string[], views: string[] } = {
    components: [],
    views: [],
  };

  for (const filePath of templateFilePaths) {
    const isComponent = filePath.startsWith(options.componentDir);
    const fullPath = path.join(templateDir, filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const compiledTemplate = etaInstance.compile(fileContent);
    if (isComponent) {
      const componentName = '@' + filePath.replace(options.extension, '').split('/').slice(1).join('_');
      etaInstance.loadTemplate(componentName, compiledTemplate);
      loadedTemplates.components.push(componentName);
    } else {
      etaInstance.loadTemplate(filePath, compiledTemplate);
      loadedTemplates.views.push(filePath);
    }
  }

  const entryPointCompiledTemplate = etaInstance.compile(
    fs.readFileSync(resolvedEntryPoint, {
      encoding: 'utf-8',
      flag: 'r'
    })
  );

  return {
    render: (data: Record<string, unknown> = {}) => {
      return etaInstance.render(
        entryPointCompiledTemplate,
        data
      );
    },
    loadedTemplates,
  };
}
