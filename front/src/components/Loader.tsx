type LoaderProps = {
  message?: string
}

export const Loader = ({ message = "Chargement..." }: LoaderProps) => {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="loader-progress-bar h-full w-2/5 rounded-full bg-primary" />
        </div>

        <div className="flex items-center gap-3" role="status" aria-live="polite" aria-busy="true">
          <span className="loader-orbit inline-flex h-7 w-7 shrink-0" />
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}
