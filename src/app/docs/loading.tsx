export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] gap-8 px-5 pt-10 pb-28 sm:px-8 md:pt-12 lg:px-10">
      <div className="max-w-300 min-w-0 flex-1 animate-pulse">
        <div className="bg-surface-2 rounded-chip h-3.5 w-48" />
        <div className="bg-surface-2 rounded-chip mt-5 h-11 w-3/4" />
        <div className="bg-surface-2 rounded-chip mt-5 h-5 w-2/3" />
        <div className="bg-surface-2 rounded-chip mt-6 h-4 w-40" />
        <div className="bg-border mt-6 h-px w-full" />

        <div className="mt-10 space-y-4">
          <div className="bg-surface-2 rounded-chip h-4 w-full" />
          <div className="bg-surface-2 rounded-chip h-4 w-11/12" />
          <div className="bg-surface-2 rounded-chip h-4 w-full" />
          <div className="bg-surface-2 rounded-chip h-4 w-4/5" />
          <div className="bg-surface-2 rounded-chip mt-12 h-7 w-1/3" />
          <div className="bg-surface-2 rounded-chip h-4 w-full" />
          <div className="bg-surface-2 rounded-chip h-4 w-10/12" />
        </div>
      </div>
      <div className="hidden w-72 shrink-0 animate-pulse space-y-3 xl:block">
        <div className="bg-surface-2 rounded-chip h-3.5 w-24" />
        <div className="bg-surface-2 rounded-chip h-3.5 w-40" />
        <div className="bg-surface-2 rounded-chip h-3.5 w-32" />
        <div className="bg-surface-2 rounded-chip h-3.5 w-36" />
      </div>
    </div>
  );
}
