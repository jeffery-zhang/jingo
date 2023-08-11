import { create } from 'zustand'

interface IGlobalStore {
  theme: 'emerald' | 'forest'
  setTheme: (theme: IGlobalStore['theme']) => void
}

const initialTheme = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('theme') || 'emerald'
  }
  return 'emerald'
}

export const useGlobalStore = create<IGlobalStore>((set, get) => ({
  theme: initialTheme() as IGlobalStore['theme'],
  setTheme(theme) {
    if (get().theme === theme) return
    if (typeof window !== 'undefined') {
      console.log(theme)
      window.localStorage.setItem('theme', theme)
      window.document.documentElement.setAttribute('data-theme', theme)
    }
    set({ theme })
  },
}))
