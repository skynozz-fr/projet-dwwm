type LoaderProps = {
  message?: string
}

export const Loader = ({ message = "Chargement..." }: LoaderProps) => {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}
