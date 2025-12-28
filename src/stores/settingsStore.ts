import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
    setSuperpowersPath: (path: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            superpowersPath: 'c:/AI/In Progress/Superpowers',
            setSuperpowersPath: (path) => set({ superpowersPath: path }),
        }),
        {
            name: 'superpowers-settings',
        }
    )
);
