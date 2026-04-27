import type { SearchQuery } from "@/types";

type SortBy = SearchQuery["sortBy"];

interface FilterPanelProps {
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
}

export default function FilterPanel({ sortBy, onSortChange }: FilterPanelProps) {
  const options: { value: SortBy; label: string }[] = [
    { value: "views", label: "Vues" },
    { value: "engagement", label: "Engagement" },
    { value: "likes", label: "Likes" },
    { value: "recent", label: "Récent" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Trier par :</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSortChange(opt.value)}
          className={`px-3 py-1 text-sm rounded-full border ${
            sortBy === opt.value ? "bg-black text-white border-black" : "border-gray-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
