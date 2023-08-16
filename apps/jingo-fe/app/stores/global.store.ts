import { create } from 'zustand'

export enum Theme {
  'EMERALD' = 'emerald',
  'FOREST' = 'forest',
}

interface IGlobalStore {
  theme: Theme
  setTheme: (theme: IGlobalStore['theme']) => void
}

export const useGlobalStore = create<IGlobalStore>((set, get) => ({
  theme: Theme.EMERALD,
  setTheme(theme) {
    if (get().theme === theme) return
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme)
      window.document.documentElement.setAttribute('data-theme', theme)
    }
    set({ theme })
  },
}))
