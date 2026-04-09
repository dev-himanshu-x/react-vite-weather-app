export default function ErrorMessage({ message, onDismiss, onRetry }) {
  return (
    <div className="rounded-2xl border-4 border-black bg-[#ffb0b9] p-4 text-black shadow-[8px_8px_0_#111111]">
      <p className="text-base font-extrabold">Could not fetch weather</p>
      <p className="mt-1 text-sm font-semibold text-black/80">{message}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-lg border-3 border-black bg-black px-4 py-2 text-sm font-extrabold text-white shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="inline-flex items-center justify-center rounded-lg border-3 border-black bg-white px-4 py-2 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
