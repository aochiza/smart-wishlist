import { useApp } from '../hooks/useApp';
import { Wish } from '../types';
import { formatCurrency, calcProgress } from '../utils';
import { TrendingUp, ShoppingBag, Target, Wallet, Star, Award } from 'lucide-react';
import styles from './Dashboard.module.css';

function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.accent : ''}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statInfo}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
        {sub && <span className={styles.statSub}>{sub}</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useApp();
  const wishes = state.wishes;

  const total = wishes.length;
  const bought = wishes.filter(w => w.status === 'bought').length;
  const totalCost = wishes.reduce((s, w) => s + w.price, 0);
  const totalSaved = wishes.reduce((s, w) => s + w.saved, 0);
  const avgPrice = total ? totalCost / total : 0;
  const completePct = total ? Math.round((bought / total) * 100) : 0;

  const pinned = wishes.filter(w => w.pinned);
  const highPriority = wishes.filter(w => w.priority === 'high' && w.status !== 'bought');
  const savingNow = wishes.filter(w => w.status === 'saving');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Дашборд</h1>
        <p className={styles.sub}>Обзор ваших целей и прогресса</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard icon={<ShoppingBag size={20} />} label="Всего желаний" value={String(total)} accent />
        <StatCard icon={<Award size={20} />} label="Куплено" value={String(bought)} sub={`${completePct}% выполнено`} />
        <StatCard icon={<Wallet size={20} />} label="Накоплено" value={formatCurrency(totalSaved)} sub={`из ${formatCurrency(totalCost)}`} />
        <StatCard icon={<TrendingUp size={20} />} label="Общая стоимость" value={formatCurrency(totalCost)} />
        <StatCard icon={<Target size={20} />} label="Средняя цена" value={formatCurrency(avgPrice)} />
        <StatCard icon={<Star size={20} />} label="Закреплено" value={String(pinned.length)} />
      </div>

      <div className={styles.sections}>
        {savingNow.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Коплю сейчас</h2>
            <div className={styles.progressList}>
              {savingNow.map(w => {
                const pct = calcProgress(w);
                return (
                  <div key={w.id} className={styles.progressItem}>
                    <div className={styles.progressMeta}>
                      <span className={styles.progressName}>{w.title}</span>
                      <span className={styles.progressAmt}>
                        {formatCurrency(w.saved)} / {formatCurrency(w.price)}
                      </span>
                    </div>
                    <div className={styles.progressBarWrap}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={styles.progressPct}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {highPriority.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Высокий приоритет</h2>
            <div className={styles.wishList}>
              {highPriority.slice(0, 5).map(w => (
                <div key={w.id} className={styles.wishRow}>
                  <div className={styles.wishInfo}>
                    <span className={styles.wishTitle}>{w.title}</span>
                    <span className={styles.wishCat}>{w.category}</span>
                  </div>
                  <span className={styles.wishPrice}>{formatCurrency(w.price)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
