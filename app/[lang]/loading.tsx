export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-persici-crimson border-t-transparent" />
        <p className="text-sm text-foreground/60">Loading...</p>
      </div>
    </div>
  );
}
