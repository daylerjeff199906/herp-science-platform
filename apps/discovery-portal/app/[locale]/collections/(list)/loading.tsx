export default function Loading() {
  return (
    <div className="mx-auto w-full space-y-4 p-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg bg-white p-6 shadow-sm"
        >
          {/* Species name */}
          <div className="mb-4 h-6 w-2/3 rounded-md bg-gray-200" />

          {/* Registration status */}
          <div className="mb-3 h-4 w-1/4 rounded-md bg-gray-200" />

          {/* Sex information */}
          <div className="mb-3 h-4 w-1/3 rounded-md bg-gray-200" />

          {/* Collection date */}
          <div className="mb-3 h-4 w-2/5 rounded-md bg-gray-200" />

          {/* Location */}
          <div className="h-4 w-5/6 rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
