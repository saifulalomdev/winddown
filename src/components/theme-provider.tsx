// src/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { Storage } from "@/utils/storage-helper"
import { StatusBar, Style } from "@capacitor/status-bar"
import { Capacitor } from "@capacitor/core"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isLoading: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isLoading: true,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app_theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 1. Load saved theme from Storage
  useEffect(() => {
    async function loadSavedTheme() {
      try {
        const savedTheme = await Storage.get<Theme>(storageKey)
        if (savedTheme) {
          setThemeState(savedTheme)
        }
      } catch (error) {
        console.error("Failed to load saved theme:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedTheme()
  }, [storageKey])

  // 2. Apply theme class and update Native Status Bar
  useEffect(() => {
    const root = window.document.documentElement

    const applyThemeAndStatusBar = async (targetTheme: Theme) => {
      let isDark = false

      if (targetTheme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      } else {
        isDark = targetTheme === "dark"
      }

      // Update HTML root class for web/Tailwind
      root.classList.remove("light", "dark")
      root.classList.add(isDark ? "dark" : "light")

      // Update Native Status Bar Icons & Text on iOS/Android
      if (Capacitor.isNativePlatform()) {
        try {
          // Style.Dark  -> Light text/icons for DARK backgrounds
          // Style.Light -> Dark text/icons for LIGHT backgrounds
          await StatusBar.setStyle({
            style: isDark ? Style.Dark : Style.Light,
          })
        } catch (error) {
          console.error("Failed to set status bar style:", error)
        }
      }
    }

    applyThemeAndStatusBar(theme)

    // Listen for OS system theme changes when "system" is selected
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyThemeAndStatusBar("system")

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // 3. Save theme changes using Storage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    Storage.set(storageKey, newTheme).catch((error) => {
      console.error("Failed to save theme setting:", error)
    })
  }

  const value = {
    theme,
    setTheme,
    isLoading,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}