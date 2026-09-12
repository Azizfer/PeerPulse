export default function Loading() {
  return (
    <div className="min-h-screen bg-paper animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-8 bg-line-strong rounded w-48 mb-6"></div>
        <div className="h-10 bg-line-strong rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-line-strong rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
