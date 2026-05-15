export function CheckoutPaymentSkeleton() {
  return (
    <div className="animate-pulse mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <div
        className="
          rounded-3xl
          border-2 border-gray-100
          bg-white
          p-6
          space-y-6
        "
      >
        {/* Header */}
        <div className="space-y-3">
          <div className="h-6 w-52 rounded-full bg-gray-200" />
          <div className="h-4 w-72 rounded-full bg-gray-100" />
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded-full bg-gray-200" />
            <div className="h-4 w-16 rounded-full bg-gray-200" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded-full bg-gray-200" />
            <div className="h-4 w-20 rounded-full bg-gray-200" />
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="h-5 w-20 rounded-full bg-gray-300" />
            <div className="h-6 w-24 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-gray-200" />

          <div className="rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded-full bg-gray-200" />
              <div className="h-3 w-28 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>

        {/* Processing Box */}
        <div className="rounded-2xl bg-gray-50 p-5 space-y-3">
          <div className="h-4 w-44 rounded-full bg-gray-200" />

          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-gray-100" />
            <div className="h-3 w-5/6 rounded-full bg-gray-100" />
          </div>
        </div>

        {/* Button */}
        <div className="h-12 w-full rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}