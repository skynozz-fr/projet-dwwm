import { useId } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const ThemeToggle = () => {
  const id = useId()
  const { theme, toggleTheme } = useTheme()
  const checked = theme === "dark"

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm">
      <SunIcon size={15} className={checked ? "text-muted-foreground" : "text-primary"} aria-hidden="true" />
      <Switch id={id} checked={checked} onCheckedChange={toggleTheme} aria-label="Basculer entre thème clair et sombre" />
      <MoonIcon size={15} className={checked ? "text-primary" : "text-muted-foreground"} aria-hidden="true" />
      <Label htmlFor={id} className="sr-only">
        {theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
      </Label>
    </div>
  )
}
