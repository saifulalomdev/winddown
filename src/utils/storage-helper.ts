// src/utils/storage-helper.ts
import { Preferences } from '@capacitor/preferences';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

export interface StorageOptions {
    secure?: boolean;
}

// Helper interface to standardize storage operations
interface StorageEngine {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}

// Adapters for Preferences and SecureStorage
const standardStore: StorageEngine = {
    get: async (key) => (await Preferences.get({ key })).value,
    set: (key, value) => Preferences.set({ key, value }),
    remove: (key) => Preferences.remove({ key }),
};

const secureStore: StorageEngine = {
    get: async (key) => {
        const res = await SecureStorage.get(key);
        return res !== null ? String(res) : null;
    },
    set: (key, value) => SecureStorage.set(key, value),
    remove: async (key) => {
        await SecureStorage.remove(key);
    },
};

const getEngine = (secure?: boolean): StorageEngine =>
    secure ? secureStore : standardStore;

export const Storage = {
    /**
     * Save any data type.
     */
    async set<T>(key: string, value: T, options?: StorageOptions): Promise<void> {
        const engine = getEngine(options?.secure);
        const serializedValue = JSON.stringify(value);
        await engine.set(key, serializedValue);
    },

    /**
     * Get data and automatically parse it back to its type.
     */
    async get<T>(key: string, options?: StorageOptions): Promise<T | null> {
        const engine = getEngine(options?.secure);
        const rawValue = await engine.get(key);

        if (rawValue === null) return null;

        try {
            return JSON.parse(rawValue) as T;
        } catch {
            return rawValue as unknown as T;
        }
    },

    /**
     * Delete a item from storage.
     */
    async delete(key: string, options?: StorageOptions): Promise<void> {
        const engine = getEngine(options?.secure);
        await engine.remove(key);
    },

    /**
     * Clear all stored items.
     */
    async clear(options?: StorageOptions): Promise<void> {
        if (options?.secure) {
            await SecureStorage.clear();
        } else {
            await Preferences.clear();
        }
    },
};