/* eslint-disable @typescript-eslint/no-explicit-any -- ok */
// https://stackoverflow.com/questions/50019920/javascript-map-key-value-pairs-case-insensitive-search
export class CaseInsensitiveMap<T, U> extends Map<T, U> {
    constructor(values?: Iterable<[T, U]>) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- this is a valid use case
        values
            ? super(
                  Array.from(values, ([key, value]) => {
                      if (typeof key === 'string') {
                          key = key.toLowerCase() as any as T;
                      }

                      return [key, value] as [T, U];
                  }),
              )
            : super();
    }

    set(key: T, value: U): this {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }
        return super.set(key, value);
    }

    get(key: T): U | undefined {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }

        return super.get(key);
    }

    has(key: T): boolean {
        if (typeof key === 'string') {
            key = key.toLowerCase() as any as T;
        }

        return super.has(key);
    }
}
