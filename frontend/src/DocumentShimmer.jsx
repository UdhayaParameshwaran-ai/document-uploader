export const DocumentShimmer = () => {
  return (
    <ul className="divide-y divide-gray-200 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <li key={i} className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />

            <div>
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
};
