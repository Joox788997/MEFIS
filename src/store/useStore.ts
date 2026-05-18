import { create } from 'zustand';

interface Entity {
  id: string;
  name: string;
  type: string;
  metadata: any;
}

interface UserState {
  currentEntity: Entity | null;
  setCurrentEntity: (entity: Entity | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useStore = create<UserState>((set) => ({
  currentEntity: null,
  setCurrentEntity: (entity) => set({ currentEntity: entity }),
  isDarkMode: true, // Default to dark mode as requested for modern look
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (value) => set({ isDarkMode: value }),
}));
