import type { TikTokVideo } from "@/types";

interface SearchResultsProps {
  results: TikTokVideo[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      {results.map((video, i) => (
        <div key={video.id ?? i} className="bg-white p-4 rounded-xl border">
          <div className="flex items-start justify-between">
            <p className="font-medium flex-1">{video.hook}</p>
            <span className="text-xs text-gray-400 ml-2">#{i + 1}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {video.views?.toLocaleString()} vues · {video.likes?.toLocaleString()} likes ·{" "}
            {video.duration}s
          </p>
          <p className="text-xs text-gray-400 mt-1">@{video.creatorHandle}</p>
        </div>
      ))}
    </div>
  );
}
