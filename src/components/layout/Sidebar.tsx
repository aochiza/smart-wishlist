import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, BarChart2, LayoutDashboard,
  Sun, Moon, Download, Upload, Plus,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { exportData, importData } from '../../store/storage';
import styles from './Sidebar.module.css';

interface Props {
  onNewWish: () => void;
}

export default function Sidebar({ onNewWish }: Props) {
  const { state, dispatch } = useApp();

  const toggleTheme = () =>
    dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' });

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const data = await importData(file);
        dispatch({ type: 'IMPORT', state: data });
      } catch (err) {
        alert('Ошибка импорта: ' + (err as Error).message);
      }
    };
    input.click();
  };

  const bought = state.wishes.filter(w => w.status === 'bought').length;
  const total = state.wishes.length;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>✦</div>
        <span>Wishlist</span>
      </div>

      <button className={styles.newBtn} onClick={onNewWish}>
        <Plus size={16} />
        Новое желание
      </button>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Навигация</span>
        <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <LayoutGrid size={18} /> Доска
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <LayoutDashboard size={18} /> Дашборд
        </NavLink>
        <NavLink to="/statistics" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <BarChart2 size={18} /> Аналитика
        </NavLink>
      </nav>

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Всего желаний</span>
          <span className={styles.statValue}>{total}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Куплено</span>
          <span className={styles.statValue}>{bought}</span>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: total ? `${Math.round((bought / total) * 100)}%` : '0%' }}
            />
          </div>
          <span className={styles.progressText}>{total ? Math.round((bought / total) * 100) : 0}%</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <button className={styles.iconBtn} onClick={() => exportData(state)} title="Экспорт">
          <Download size={16} />
          <span>Экспорт</span>
        </button>
        <button className={styles.iconBtn} onClick={handleImport} title="Импорт">
          <Upload size={16} />
          <span>Импорт</span>
        </button>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Тема">
          {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{state.theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
        </button>
      </div>
    </aside>
  );
}
