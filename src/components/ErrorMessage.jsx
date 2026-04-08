export default function ErrorMessage({ message, onDismiss, onRetry }) {
  return (
    <div className="rounded-xl border-4 border-black bg-[#ffb0b9] p-4 text-black shadow-[8px_8px_0_#111111]">
      <p className="text-base font-bold">Could not fetch weather</p>
      <p className="mt-1 text-sm">{message}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-lg border-4 border-black bg-black px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#111111]"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="inline-flex items-center justify-center rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_#111111]"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
