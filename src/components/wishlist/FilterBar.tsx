import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Filters } from '../../hooks/useWishFilter';
import { WishPriority, WishStatus, STATUS_LABELS, PRIORITY_LABELS } from '../../types';
import styles from './FilterBar.module.css';

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  resetFilters: () => void;
  categories: string[];
}

export default function FilterBar({ filters, setFilters, resetFilters, categories }: Props) {
  const [showMore, setShowMore] = useState(false);
  const set = (k: keyof Filters, v: string) => setFilters({ ...filters, [k]: v });

  const hasActive = Object.values(filters).some(v => v !== '');

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.search}
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          placeholder="Поиск по названию, описанию, категории…"
        />
        {filters.search && (
          <button className={styles.clearSearch} onClick={() => set('search', '')}>
            <X size={13} />
          </button>
        )}
      </div>

      <button
        className={`${styles.filterBtn} ${showMore ? styles.filterBtnActive : ''}`}
        onClick={() => setShowMore(p => !p)}
      >
        <SlidersHorizontal size={14} />
        Фильтры
        {hasActive && <span className={styles.dot} />}
      </button>

      {hasActive && (
        <button className={styles.resetBtn} onClick={resetFilters}>
          <X size={13} /> Сбросить
        </button>
      )}

      {showMore && (
        <div className={styles.moreFilters}>
          <select className={styles.select} value={filters.category} onChange={e => set('category', e.target.value)}>
            <option value="">Все категории</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={styles.select} value={filters.status} onChange={e => set('status', e.target.value as WishStatus | '')}>
            <option value="">Все статусы</option>
            {(['want', 'planning', 'saving', 'bought'] as WishStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select className={styles.select} value={filters.priority} onChange={e => set('priority', e.target.value as WishPriority | '')}>
            <option value="">Все приоритеты</option>
            {(['high', 'medium', 'low'] as WishPriority[]).map(p => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>

          <div className={styles.priceRange}>
            <input
              className={styles.priceInput}
              type="number" placeholder="Цена от"
              value={filters.priceMin}
              onChange={e => set('priceMin', e.target.value)}
            />
            <span className={styles.dash}>—</span>
            <input
              className={styles.priceInput}
              type="number" placeholder="до"
              value={filters.priceMax}
              onChange={e => set('priceMax', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
