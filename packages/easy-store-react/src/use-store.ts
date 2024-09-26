import { Store } from "@easy/store";
import { useSyncExternalStore } from "react";

export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore<T>(store.subscribe, store.get);
}
