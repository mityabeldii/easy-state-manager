export function createEmitter<T extends Function>(context = null) {
    let listeners: T[] = [];
    return {
        listeners,
        addListener: (listener: T) => {
            listeners.push(listener);
        },
        removeListener: (listener: T) => {
            listeners = listeners.filter((_listener, index) => index !== listeners.indexOf(listener));
        },
        trigger: <T>(...args: any) => {
            listeners.forEach((listener) => listener.apply(context, args));
        },
        removeAllListeners: () => {
            listeners = [];
        },
    };
}
