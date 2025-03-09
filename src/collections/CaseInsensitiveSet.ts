/* eslint-disable @typescript-eslint/no-explicit-any -- ok */
// https://stackoverflow.com/questions/50019920/javascript-map-key-value-pairs-case-insensitive-search
export class CaseInsensitiveSet<T> extends Set<T> {
    constructor(values?: Iterable<T>) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- this is a valid use case
        values
            ? super(
                  Array.from(values, (key) => {
                      if (typeof key === 'string') {
                          key = key.toLowerCase() as any as T;
                      }

                      return key;
                  }),
              )
            : super();
    }

    add(key: T) {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }

        return super.add(key);
    }

    has(key: T) {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }

        return super.has(key);
    }

    delete(key: T) {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }

        return super.delete(key);
    }
}
