import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';


/**
  * Get the directory of the current script.
  */
export function getScriptPath() {
  const pathUrlPath = new URL(import.meta.url).pathname;
  return path.dirname(
    os.platform() === 'win32' ? pathUrlPath.slice(1) : pathUrlPath
  );
}


/**
  * Ensure the given file exists, creating it if it doesn't.
  */
export function ensureFileSync(filePath: string, content: string = '') {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, {
      encoding: 'utf-8'
    });
  }
  return filePath;
}


/**
  * Expand `~` to user home directory.
  * Resolve the given file path with the given base directory.
  */
export function resolvePath(filePath: string, baseDir?: string) {
  if (baseDir) {
    return path.resolve(baseDir, filePath);
  }
  if (filePath.startsWith('~/')) {
    const userHome = (
      os.platform() === 'win32'
        ? process.env.USERPROFILE
        : process.env.HOME
    );
    if (!userHome) {
      throw new ReferenceError('No user home directory found');
    }
    return path.resolve(filePath.replace('~', userHome));
  } else {
    return path.resolve(filePath);
  }
}
