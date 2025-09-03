import { Search } from 'lucide-react';

interface BlogFiltersProps {
  query: string;
  setQuery: (value: string) => void;
  categories: string[];
  activeCategories: Set<string>;
  setActiveCategories: (categories: Set<string>) => void;
}

export function BlogFilters({
  query,
  setQuery,
  categories,
  activeCategories,
  setActiveCategories
}: BlogFiltersProps) {
  const toggleCategory = (category: string) => {
    const newActive = new Set(activeCategories);
    if (newActive.has(category)) {
      newActive.delete(category);
    } else {
      newActive.add(category);
    }
    setActiveCategories(newActive);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artículos..."
          className="w-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isActive = activeCategories.has(category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg'
                  : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}