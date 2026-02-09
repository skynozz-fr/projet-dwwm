import { Popcorn } from "lucide-react"

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/15">
        <Popcorn className="h-5 w-5 text-primary" />
      </div>
      <span className="hidden sm:inline font-display text-2xl leading-none tracking-wide text-foreground">FC POPCORN</span>
    </div>
  )
}
