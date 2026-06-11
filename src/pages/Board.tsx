import { useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useApp } from '../hooks/useApp';
import { useWishFilter } from '../hooks/useWishFilter';
import { Wish, WishStatus } from '../types';
import { sortWishes } from '../utils';
import KanbanColumn from '../components/kanban/KanbanColumn';
import FilterBar from '../components/wishlist/FilterBar';
import WishModal from '../components/wishlist/WishModal';
import styles from './Board.module.css';

const COLUMNS: WishStatus[] = ['want', 'planning', 'saving', 'bought'];

export default function BoardPage() {
  const { state, dispatch } = useApp();
  const { filters, setFilters, filtered, resetFilters } = useWishFilter(state.wishes);
  const [editWish, setEditWish] = useState<Wish | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const getColumn = (status: WishStatus) =>
    sortWishes(filtered.filter(w => w.status === status));

  const activeWish = activeId ? state.wishes.find(w => w.id === activeId) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeWish = state.wishes.find(w => w.id === active.id);
    if (!activeWish) return;

    // dropped on a column (droppable id = status)
    if (COLUMNS.includes(over.id as WishStatus)) {
      const newStatus = over.id as WishStatus;
      if (activeWish.status !== newStatus) {
        dispatch({ type: 'MOVE_WISH', id: activeWish.id, status: newStatus });
      }
      return;
    }

    // dropped on another card
    const overWish = state.wishes.find(w => w.id === over.id);
    if (!overWish) return;

    if (activeWish.status !== overWish.status) {
      dispatch({ type: 'MOVE_WISH', id: activeWish.id, status: overWish.status });
    } else {
      const col = state.wishes.filter(w => w.status === activeWish.status);
      const oldIdx = col.findIndex(w => w.id === active.id);
      const newIdx = col.findIndex(w => w.id === over.id);
      if (oldIdx !== newIdx) {
        const rest = state.wishes.filter(w => w.status !== activeWish.status);
        const reordered = arrayMove(col, oldIdx, newIdx);
        dispatch({ type: 'REORDER_WISHES', wishes: [...rest, ...reordered] });
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить это желание?')) {
      dispatch({ type: 'DELETE_WISH', id });
    }
  };

  return (
    <div className={styles.page}>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        categories={state.categories}
      />

      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Доска желаний</h1>
        <span className={styles.subheading}>{filtered.length} из {state.wishes.length}</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={e => setActiveId(String(e.active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className={styles.board}>
          {COLUMNS.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              wishes={getColumn(status)}
              onEdit={setEditWish}
              onDelete={handleDelete}
              onTogglePin={id => dispatch({ type: 'TOGGLE_PIN', id })}
            />
          ))}
        </div>

        <DragOverlay>
          {activeWish && (
            <div style={{ opacity: 0.9, transform: 'rotate(2deg)', pointerEvents: 'none' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--accent)',
                borderRadius: 12,
                padding: 14,
                boxShadow: 'var(--shadow-lg)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)',
                minWidth: 220,
              }}>
                {activeWish.title}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {editWish && <WishModal wish={editWish} onClose={() => setEditWish(null)} />}
    </div>
  );
}
