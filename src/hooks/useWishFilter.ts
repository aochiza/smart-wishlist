import { useMemo, useState } from 'react';
import { Wish, WishPriority, WishStatus } from '../types';

export interface Filters {
  search: string;
  category: string;
  status: WishStatus | '';
  priority: WishPriority | '';
  priceMin: string;
  priceMax: string;
}

const defaultFilters: Filters = {
  search: '',
  category: '',
  status: '',
  priority: '',
  priceMin: '',
  priceMax: '',
};

export function useWishFilter(wishes: Wish[]) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtered = useMemo(() => {
    return wishes.filter(w => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!w.title.toLowerCase().includes(q) &&
            !w.description.toLowerCase().includes(q) &&
            !w.category.toLowerCase().includes(q)) return false;
      }
      if (filters.category && w.category !== filters.category) return false;
      if (filters.status && w.status !== filters.status) return false;
      if (filters.priority && w.priority !== filters.priority) return false;
      if (filters.priceMin && w.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && w.price > Number(filters.priceMax)) return false;
      return true;
    });
  }, [wishes, filters]);

  return { filters, setFilters, filtered, resetFilters: () => setFilters(defaultFilters) };
}
