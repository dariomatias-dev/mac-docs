export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-12 pt-12 pb-28">
      <div className="max-w-300 animate-pulse">
        <div className="bg-surface-2 h-4 w-48 rounded" />
        <div className="bg-surface-2 mt-6 h-10 w-3/4 rounded" />
        <div className="bg-surface-2 mt-4 h-4 w-40 rounded" />

        <div className="mt-10 space-y-4">
          <div className="bg-surface-2 h-4 w-full rounded" />
          <div className="bg-surface-2 h-4 w-11/12 rounded" />
          <div className="bg-surface-2 h-4 w-full rounded" />
          <div className="bg-surface-2 h-4 w-4/5 rounded" />
          <div className="bg-surface-2 mt-8 h-4 w-2/3 rounded" />
          <div className="bg-surface-2 h-4 w-full rounded" />
          <div className="bg-surface-2 h-4 w-10/12 rounded" />
        </div>
      </div>
    </div>
  );
}
