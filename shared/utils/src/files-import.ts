import type {EntryInfo, ReaddirpOptions} from 'readdirp';
import {readdirp} from 'readdirp';

interface IImportFiles {
  path: string;
  options: Partial<ReaddirpOptions>;
}

interface IReturn<T> {
  data: T;
  path: string;
}

// readdirp >=4 no longer supports glob strings in fileFilter/directoryFilter,
// it matches basenames literally. Convert simple `*.ext` and `!pattern`
// globs into tester functions while keeping exact-name strings as-is.
const toPredicate =
  (pattern: string) =>
  (entry: EntryInfo): boolean => {
    const negated = pattern.startsWith('!');
    const raw = negated ? pattern.slice(1) : pattern;
    let match: boolean;
    if (raw.startsWith('**/') || raw.startsWith('*')) {
      const suffix = raw.replace(/^\*\*\//, '').replace(/^\*/, '');
      match = entry.basename.endsWith(suffix);
    } else {
      match = entry.basename === raw || entry.path === raw;
    }
    return negated ? !match : match;
  };

const toFileFilter = (
  filter: ReaddirpOptions['fileFilter'],
): ReaddirpOptions['fileFilter'] => {
  if (Array.isArray(filter)) {
    const predicates = filter.map(toPredicate);
    return (entry: EntryInfo) =>
      predicates.every((p) => p(entry));
  }
  if (typeof filter === 'string') return toPredicate(filter);
  return filter;
};

export const importFiles = <T>({
  options,
  path,
}: IImportFiles): Promise<IReturn<T>[]> => {
  return new Promise((resolve) => {
    const files: Promise<IReturn<T>>[] = [];
    readdirp(path, {...options, fileFilter: toFileFilter(options.fileFilter)})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath, path} = entry;
        files.push(
          new Promise((resolve) => {
            import(fullPath).then((file) => {
              resolve({
                data: file?.default?.default ?? file?.default,
                path,
              });
            });
          }),
        );
      })
      .on('end', () => {
        Promise.all(files).then((data) => {
          resolve(data);
        });
      });
  });
};
