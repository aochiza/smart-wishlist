import { NavLink } from 'react-router-dom';
import { LayoutGrid, BarChart2, LayoutDashboard, X, Sun, Moon, Download, Upload, Plus } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { exportData, importData } from '../../store/storage';
import styles from './MobileSidebar.module.css';

interface Props { open: boolean; onClose: () => void; onNewWish: () => void; }

export default function MobileSidebar({ open, onClose, onNewWish }: Props) {
  const { state, dispatch } = useApp();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try { dispatch({ type: 'IMPORT', state: await importData(file) }); }
      catch (err) { alert('Ошибка: ' + (err as Error).message); }
    };
    input.click();
  };

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`} onClick={onClose} />
      <aside className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>✦ Wishlist</div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <button className={styles.newBtn} onClick={onNewWish}><Plus size={16} />Новое желание</button>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={onClose}><LayoutGrid size={18} />Доска</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={onClose}><LayoutDashboard size={18} />Дашборд</NavLink>
          <NavLink to="/statistics" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={onClose}><BarChart2 size={18} />Аналитика</NavLink>
        </nav>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={() => exportData(state)}><Download size={16} />Экспорт</button>
          <button className={styles.iconBtn} onClick={handleImport}><Upload size={16} />Импорт</button>
          <button className={styles.iconBtn} onClick={() => dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' })}>
            {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {state.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          </button>
        </div>
      </aside>
    </>
  );
}
