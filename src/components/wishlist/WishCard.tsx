import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Star, ExternalLink, Trash2, Edit2, Pin, PinOff } from 'lucide-react';
import { Wish, PRIORITY_LABELS, STATUS_LABELS } from '../../types';
import { calcProgress, formatCurrency, formatDate } from '../../utils';
import styles from './WishCard.module.css';

interface Props {
  wish: Wish;
  onEdit: (w: Wish) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function WishCard({ wish, onEdit, onDelete, onTogglePin }: Props) {
  const progress = calcProgress(wish);

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: wish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const priorityClass =
    wish.priority === 'high' ? styles.high :
    wish.priority === 'medium' ? styles.medium : styles.low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${wish.pinned ? styles.pinned : ''}`}
      {...attributes}
    >
      {/* drag handle + image */}
      <div className={styles.dragHandle} {...listeners}>
        <div className={styles.dots}>⠿</div>
      </div>

      {wish.image && (
        <div className={styles.imageWrap}>
          <img src={wish.image} alt={wish.title} className={styles.image} />
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={`${styles.priorityBadge} ${priorityClass}`}>
            {PRIORITY_LABELS[wish.priority]}
          </span>
          {wish.pinned && <Star size={13} className={styles.pinStar} fill="currentColor" />}
        </div>

        <h3 className={styles.title}>{wish.title}</h3>

        {wish.description && (
          <p className={styles.desc}>{wish.description}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.category}>{wish.category}</span>
          {wish.deadline && (
            <span className={styles.deadline}>до {formatDate(wish.deadline)}</span>
          )}
        </div>

        {wish.price > 0 && (
          <div className={styles.pricing}>
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatCurrency(wish.price)}</span>
              {wish.saved > 0 && (
                <span className={styles.saved}>
                  {formatCurrency(wish.saved)} накоплено
                </span>
              )}
            </div>
            {wish.saved > 0 && (
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${progress >= 100 ? styles.complete : ''}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={styles.progressPct}>{progress}%</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(wish.createdAt)}</span>
          <div className={styles.actions}>
            {wish.link && (
              <a href={wish.link} target="_blank" rel="noopener noreferrer" className={styles.actionBtn} title="Открыть ссылку">
                <ExternalLink size={14} />
              </a>
            )}
            <button className={styles.actionBtn} onClick={() => onTogglePin(wish.id)} title={wish.pinned ? 'Открепить' : 'Закрепить'}>
              {wish.pinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
            <button className={styles.actionBtn} onClick={() => onEdit(wish)} title="Редактировать">
              <Edit2 size={14} />
            </button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(wish.id)} title="Удалить">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
