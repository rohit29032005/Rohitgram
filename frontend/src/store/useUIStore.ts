import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  reelViewMode: boolean;
  isAdmin: boolean;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setReelViewMode: (mode: boolean) => void;
  setAdmin: (isAdmin: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'home',
  reelViewMode: false,
  isAdmin: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setReelViewMode: (mode) => set({ reelViewMode: mode }),
  setAdmin: (isAdmin) => set({ isAdmin }),
}));
