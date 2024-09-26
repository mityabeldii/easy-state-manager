import isEqual from "lodash/isEqual";
import { createEmitter } from "./create-emitter";

export type Store<T> = {
    get: <V>(getter?: ((storedValue: T) => V) | undefined) => V;
    set: (setter?: (storedValue: T) => T) => void;
    map: <V>(mapper: (storedValue: T) => V) => Store<V>;
    subscribe: (getter?: (storedValue: T) => T, callback?: (_storedValue: T) => void) => () => void;
};

export function createStore<T>(defaultValue: T): Store<T> {
    const emitter = createEmitter();

    return {
        get: <V>(getter?: (storedValue: T) => V): typeof getter extends undefined ? T : V => {
            if (getter === undefined) {
                return defaultValue as unknown as V;
            }
            return getter(defaultValue);
        },
        set: (setter = (storedValue: T) => storedValue) => {
            defaultValue = setter(defaultValue);
            emitter.trigger();
        },
        map: <V>(mapper: (storedValue: T) => V): Store<V> => {
            return createStore(mapper(defaultValue));
        },
        subscribe: (getter = (storedValue: T) => storedValue, callback?: (storedValue: T) => void) => {
            let prevValue = getter(defaultValue);
            const handler = () => {
                const nextValue = getter(defaultValue);
                if (!isEqual(prevValue, nextValue)) {
                    prevValue = nextValue;
                    if (callback) {
                        callback(nextValue);
                    }
                }
            };
            emitter.addListener(handler);
            return () => {
                emitter.removeListener(handler);
            };
        },
    };
}
