import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "./Button"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <MoonIcon className="size-6" />
      ) : (
        <SunIcon className="size-6" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
      </span>
    </Button>
  )
}
