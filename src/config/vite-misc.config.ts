import * as glob from 'glob';

import {CLIENT_DIR, SERVER_DIR, WATCH_EXTENSIONS} from './constants';

export const generateVersionedEntries = (
  entryObject: Record<string, string>,
  version: number,
) =>
  Object.fromEntries(
    Object.entries(entryObject).map(([key, value]) => [
      `${key}-${version}`,
      value,
    ]),
  );

export const generateEntryObject = (
  path: typeof CLIENT_DIR | typeof SERVER_DIR,
  baseDir: string,
) => {
  const entryFiles = glob.sync(
    `./src/${path}/**/script.+(${WATCH_EXTENSIONS.join('|')})`,
    {
      cwd: baseDir,
    },
  );

  return entryFiles.reduce<Record<string, string>>((acc, filePath: string) => {
    const offset = filePath.startsWith('./') ? 3 : 2;
    let entryName = filePath.split('/').slice(offset, -1).join('/');

    if (!entryName) {
      const parts = filePath.split('/').slice(offset).join('/').split('.');
      parts.pop();
      entryName = parts.join('.');
    }

    acc[entryName] = filePath.startsWith('./') ? filePath : `./${filePath}`;
    return acc;
  }, {});
};
