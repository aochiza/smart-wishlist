import { useEffect, useRef, useState } from 'react';
import { X, Upload, Link, Trash2 } from 'lucide-react';
import { Wish, WishPriority, WishStatus, DEFAULT_CATEGORIES, STATUS_LABELS, PRIORITY_LABELS } from '../../types';
import { useApp } from '../../hooks/useApp';
import { generateId, imageToBase64 } from '../../utils';
import styles from './WishModal.module.css';

interface Props {
  wish?: Wish;
  onClose: () => void;
}

const emptyWish = (): Omit<Wish, 'id' | 'createdAt'> => ({
  title: '',
  description: '',
  image: null,
  link: '',
  price: 0,
  saved: 0,
  category: 'Техника',
  priority: 'medium',
  status: 'want',
  deadline: null,
  notes: '',
  pinned: false,
});

export default function WishModal({ wish, onClose }: Props) {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState(wish ?? { ...emptyWish(), id: '', createdAt: '' });
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(wish?.image ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = state.categories;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await imageToBase64(file);
    setImagePreview(b64);
    set('image', b64);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (wish) {
      dispatch({ type: 'UPDATE_WISH', wish: { ...form } as Wish });
    } else {
      dispatch({
        type: 'ADD_WISH',
        wish: { ...form, id: generateId(), createdAt: new Date().toISOString() } as Wish,
      });
    }
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    dispatch({ type: 'ADD_CATEGORY', category: newCategory.trim() });
    set('category', newCategory.trim());
    setNewCategory('');
    setAddingCategory(false);
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{wish ? 'Редактировать желание' : 'Новое желание'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            {/* Left column */}
            <div className={styles.col}>
              <div className={styles.field}>
                <label className={styles.label}>Название *</label>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Например: Sony WH-1000XM5"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Описание</label>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Краткое описание…"
                  rows={3}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Цена (₽)</label>
                  <input
                    className={styles.input}
                    type="number" min="0" step="0.01"
                    value={form.price || ''}
                    onChange={e => set('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Накоплено (₽)</label>
                  <input
                    className={styles.input}
                    type="number" min="0" step="0.01"
                    value={form.saved || ''}
                    onChange={e => set('saved', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}><Link size={13} /> Ссылка на товар</label>
                <input
                  className={styles.input}
                  value={form.link}
                  onChange={e => set('link', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Дедлайн</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.deadline ? form.deadline.slice(0, 10) : ''}
                  onChange={e => set('deadline', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Заметки</label>
                <textarea
                  className={styles.textarea}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Личные заметки…"
                  rows={2}
                />
              </div>
            </div>

            {/* Right column */}
            <div className={styles.col}>
              <div className={styles.field}>
                <label className={styles.label}>Изображение</label>
                <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className={styles.imagePreview} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <Upload size={24} />
                      <span>Нажмите для загрузки</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleImageUpload}
                  />
                </div>
                {imagePreview && (
                  <button type="button" className={styles.removeImage} onClick={() => { setImagePreview(null); set('image', null); }}>
                    <Trash2 size={12} /> Удалить фото
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Категория</label>
                <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {!addingCategory ? (
                  <button type="button" className={styles.addCatBtn} onClick={() => setAddingCategory(true)}>+ Добавить категорию</button>
                ) : (
                  <div className={styles.newCatRow}>
                    <input
                      className={styles.input}
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="Название категории"
                      autoFocus
                    />
                    <button type="button" className={styles.addBtn} onClick={handleAddCategory}>ОК</button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setAddingCategory(false)}>✕</button>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Приоритет</label>
                <div className={styles.pills}>
                  {(['low', 'medium', 'high'] as WishPriority[]).map(p => (
                    <button
                      key={p} type="button"
                      className={`${styles.pill} ${styles[`pill_${p}`]} ${form.priority === p ? styles.pillActive : ''}`}
                      onClick={() => set('priority', p)}
                    >
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Статус</label>
                <div className={styles.statusPills}>
                  {(['want', 'planning', 'saving', 'bought'] as WishStatus[]).map(s => (
                    <button
                      key={s} type="button"
                      className={`${styles.statusPill} ${styles[`status_${s}`]} ${form.status === s ? styles.statusPillActive : ''}`}
                      onClick={() => set('status', s)}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={e => set('pinned', e.target.checked)}
                />
                <span>Закрепить желание</span>
              </label>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="button" className={styles.cancelBtn2} onClick={onClose}>Отмена</button>
            <button type="submit" className={styles.submitBtn}>
              {wish ? 'Сохранить' : 'Добавить желание'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
