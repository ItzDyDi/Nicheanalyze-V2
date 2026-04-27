"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 p-3 border rounded-xl"
        placeholder="Ex: chien anxieux, pet training..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-black text-white px-5 py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "..." : "Rechercher"}
      </button>
    </div>
  );
}
