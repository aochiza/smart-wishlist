import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WishModal from '../wishlist/WishModal';
import MobileSidebar from './MobileSidebar';
import styles from './Layout.module.css';

export default function Layout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar onNewWish={() => setModalOpen(true)} />
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNewWish={() => { setModalOpen(true); setMobileMenuOpen(false); }}
      />
      <main className={styles.main}>
        <div className={styles.mobileHeader}>
          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(true)}>
            <span /><span /><span />
          </button>
          <div className={styles.mobileLogo}>✦ Wishlist</div>
          <button className={styles.mobileNew} onClick={() => setModalOpen(true)}>+</button>
        </div>
        <Outlet context={{ onNewWish: () => setModalOpen(true) }} />
      </main>
      {modalOpen && <WishModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
