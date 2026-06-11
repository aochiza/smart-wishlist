import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Wish, WishStatus, STATUS_LABELS } from '../../types';
import WishCard from '../wishlist/WishCard';
import styles from './KanbanColumn.module.css';

const STATUS_COLORS: Record<WishStatus, string> = {
  want: '#6c47ff',
  planning: '#3b82f6',
  saving: '#f59e0b',
  bought: '#22c55e',
};

interface Props {
  status: WishStatus;
  wishes: Wish[];
  onEdit: (w: Wish) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function KanbanColumn({ status, wishes, onEdit, onDelete, onTogglePin }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`${styles.column} ${isOver ? styles.over : ''}`}>
      <div className={styles.header}>
        <div className={styles.dot} style={{ background: STATUS_COLORS[status] }} />
        <span className={styles.label}>{STATUS_LABELS[status]}</span>
        <span className={styles.count}>{wishes.length}</span>
      </div>

      <SortableContext items={wishes.map(w => w.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={styles.cards}>
          {wishes.length === 0 && (
            <div className={styles.empty}>
              <span>Перетащите сюда</span>
            </div>
          )}
          {wishes.map(w => (
            <WishCard
              key={w.id}
              wish={w}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
